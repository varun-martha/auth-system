const featureCards = [
  {
    title: "Credential auth",
    description: "Register and sign in with clear validation and safe failure handling."
  },
  {
    title: "Google SSO",
    description: "Offer users a faster path into the product with a familiar identity flow."
  },
  {
    title: "Protected dashboard",
    description: "Confirm authentication success immediately with profile-aware post-login views."
  }
];

export function FeatureGrid() {
  return (
    <section className="feature-grid">
      {featureCards.map((featureCard) => (
        <article className="feature-card" key={featureCard.title}>
          <h2>{featureCard.title}</h2>
          <p>{featureCard.description}</p>
        </article>
      ))}
    </section>
  );
}
