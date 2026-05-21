import Link from "next/link";

export function AuthCtaBar() {
  return (
    <div className="cta-bar">
      <strong>Quietly secure. Visibly polished.</strong>
      <div className="hero-actions">
        <Link className="cta-link" href="/sign-in">
          Sign in
        </Link>
        <Link className="primary-button" href="/sign-up">
          Create account
        </Link>
      </div>
    </div>
  );
}
