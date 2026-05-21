"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getFrontendEnv } from "@/lib/env";
import { setCachedUser } from "@/lib/session";
import { loginWithGoogle } from "@/services/auth/google-sign-in";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (container: HTMLElement, options: { theme: string; size: string }) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton() {
  const router = useRouter();
  const routerRef = useRef(router);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { googleClientId } = getFrontendEnv();
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const handleCredentialResponse = useCallback(async (response: { credential?: string }) => {
    if (!response?.credential) {
      setError("Google sign-in failed to return a credential.");
      return;
    }

    try {
      const result = await loginWithGoogle(response.credential);
      setCachedUser(result.user);
      routerRef.current.push(result.redirectTo);
      routerRef.current.refresh();
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Unable to complete Google sign-in. Please try again.");
    }
  }, []);

  useEffect(() => {
    const scriptSrc = "https://accounts.google.com/gsi/client";

    function renderGoogleButton() {
      if (!window.google?.accounts?.id || !buttonContainerRef.current) {
        return false;
      }

      window.google.accounts.id.renderButton(buttonContainerRef.current, {
        theme: "outline",
        size: "large"
      });
      return true;
    }

    function initializeGoogleIdentity() {
      if (hasInitializedRef.current || !window.google?.accounts?.id) {
        return false;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse
      });
      renderGoogleButton();
      hasInitializedRef.current = true;
      setIsReady(true);
      return true;
    }

    if (initializeGoogleIdentity()) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`);
    let mounted = true;

    const handleLoad = () => {
      if (!mounted) return;
      if (!initializeGoogleIdentity()) {
        setError("Unable to load Google sign-in.");
      }
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      if (existingScript.getAttribute("data-loaded") === "true") {
        handleLoad();
      }
    } else {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        script.setAttribute("data-loaded", "true");
        handleLoad();
      };
      script.onerror = () => setError("Unable to load Google sign-in.");
      document.body.appendChild(script);
    }

    return () => {
      mounted = false;
      if (existingScript) {
        existingScript.removeEventListener("load", handleLoad);
      }
    };
  }, [googleClientId, handleCredentialResponse]);

  return (
    <>
      <div ref={buttonContainerRef} />
      {!isReady && !error ? <p>Loading Google sign-in…</p> : null}
      {error ? <p className="error-message" role="alert">{error}</p> : null}
    </>
  );
}
