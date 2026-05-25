"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getFrontendEnv } from "@/lib/env";
import { setCachedUser } from "@/lib/session";
import { loginWithGoogle } from "@/services/auth/google-sign-in";
import Script from "next/script";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            container: HTMLElement,
            options: { theme: string; size: string; width?: string }
          ) => void;
        };
      };
    };
    __gsiInitialized?: boolean;
  }
}

export function GoogleSignInButton() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { googleClientId } = getFrontendEnv();
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const handleCredentialResponse = useCallback(
    async (response: { credential?: string }) => {
      if (!response?.credential) {
        setError("Google sign-in failed to return a credential.");
        return;
      }

      try {
        const result = await loginWithGoogle(response.credential);
        setCachedUser(result.user);
        router.push(result.redirectTo);
        router.refresh();
      } catch (err) {
        console.error("Google sign-in error:", err);
        setError("Unable to complete Google sign-in. Please try again.");
      }
    },
    [router]
  );

  const initGoogle = useCallback(() => {
    if (!window.google?.accounts?.id || !buttonContainerRef.current) {
      return;
    }

    try {
      if (!window.__gsiInitialized) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse
        });
        window.__gsiInitialized = true;
      }

      window.google.accounts.id.renderButton(buttonContainerRef.current, {
        theme: "outline",
        size: "large"
      });
      setIsReady(true);
      setError(null);
    } catch (err) {
      console.error("Error initializing Google Identity", err);
      setError("Unable to load Google sign-in.");
    }
  }, [googleClientId, handleCredentialResponse]);

  useEffect(() => {
    // If the script is already loaded when the component mounts
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      // Poll for it in case the script is loaded but window.google isn't ready
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);

      // Stop polling after 5 seconds
      setTimeout(() => clearInterval(interval), 5000);
      return () => clearInterval(interval);
    }
  }, [initGoogle]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
        onLoad={initGoogle}
        onError={() => setError("Unable to load Google sign-in script.")}
      />
      <div
        ref={buttonContainerRef}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          minHeight: "40px"
        }}
      />
      {!isReady && !error ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.9rem"
          }}
        >
          Loading Google sign-in…
        </p>
      ) : null}
      {error ? (
        <p
          className="auth-feedback"
          style={{ textAlign: "center", marginTop: "1rem" }}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </>
  );
}
