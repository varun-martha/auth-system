import Link from "next/link";

export function HeroSection() {
  return (
    <section className="hero-section">
      <p>Authentication for modern web experiences</p>
      <h1 className="hero-title">
        Launch a clean, secure sign-in experience with confidence.
      </h1>
      <p className="hero-copy">
        Welcome users with a refined landing page, streamlined sign-up, and
        flexible credential or Google sign-in flows that lead directly into a
        protected dashboard.
      </p>
      <div className="hero-actions">
        <Link className="primary-button" href="/sign-up">
          Start with sign up
        </Link>
        <Link className="secondary-button" href="/sign-in">
          I already have an account
        </Link>
      </div>
    </section>
  );
}
