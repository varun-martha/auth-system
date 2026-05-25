import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";
import { getCurrentUser } from "@/services/auth/get-current-user";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  let isAuthenticated = false;
  try {
    await getCurrentUser();
    isAuthenticated = true;
  } catch {
    // Not authenticated, render login page
  }

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-page">
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          fontSize: "1.5rem",
          fontWeight: 800,
          letterSpacing: "0.1em",
          textDecoration: "none",
          zIndex: 10
        }}
      >
        <span style={{ color: "var(--text-primary)" }}>PAY</span>
        <span style={{ color: "var(--brand-accent)" }}>SPLIT</span>
      </Link>
      <section className="auth-panel">
        <h1>Welcome back</h1>
        <p>Sign in with your credentials or continue with Google.</p>
        <SignInForm />
        <div className="auth-divider">or</div>
        <GoogleSignInButton />

        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "0.9rem",
            color: "var(--text-muted)"
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "var(--brand-accent)",
              fontWeight: 500,
              textDecoration: "none"
            }}
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
