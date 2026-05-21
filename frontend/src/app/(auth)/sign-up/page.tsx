import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Create your account</h1>
        <p>Register with your username, email, and password to continue.</p>
        <SignUpForm />
      </section>
    </main>
  );
}
