"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { setCachedUser } from "@/lib/session";
import { loginUser } from "@/services/auth/login-user";

export function SignInForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await loginUser({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || "")
      });
      setCachedUser(response.user);
      router.push(response.redirectTo);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="auth-form">
      <AuthErrorBanner message={errorMessage} />
      <label className="auth-field">
        <span>Email</span>
        <input
          name="email"
          placeholder="jane@example.com"
          required
          type="email"
        />
      </label>
      <label className="auth-field">
        <span>Password</span>
        <input
          name="password"
          placeholder="••••••••"
          required
          type="password"
        />
      </label>
      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
