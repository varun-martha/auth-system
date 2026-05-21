"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { setCachedUser } from "@/lib/session";
import { registerUser } from "@/services/auth/register-user";
import { SignUpFeedback } from "@/components/auth/SignUpFeedback";

export function SignUpForm() {
  const router = useRouter();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      const response = await registerUser({
        username: String(formData.get("username") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || "")
      });

      setCachedUser(response.user);
      router.push(response.redirectTo);
      router.refresh();
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "Unable to register.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="auth-form">
      <label className="auth-field">
        <span>Username</span>
        <input name="username" placeholder="janedoe" required type="text" />
      </label>
      <label className="auth-field">
        <span>Email</span>
        <input name="email" placeholder="jane@example.com" required type="email" />
      </label>
      <label className="auth-field">
        <span>Password</span>
        <input name="password" placeholder="••••••••" required type="password" />
      </label>
      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
      <SignUpFeedback message={feedbackMessage} />
    </form>
  );
}
