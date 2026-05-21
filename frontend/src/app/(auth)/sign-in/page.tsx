import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Welcome back</h1>
        <p>Sign in with your credentials or continue with Google.</p>
        <SignInForm />
        <div className="auth-divider">or</div>
        <GoogleSignInButton />
      </section>
    </main>
  );
}
