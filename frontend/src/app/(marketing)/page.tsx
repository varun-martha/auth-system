import Link from 'next/link';
import React from 'react';
import { getCurrentUser } from "@/services/auth/get-current-user";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  let isAuthenticated = false;
  try {
    await getCurrentUser();
    isAuthenticated = true;
  } catch {
    // Not authenticated, render landing page
  }

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <main className="landing-page">
      {/* Navigation / Header */}
      <nav style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'relative' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.1em' }}>
          <span style={{ color: 'var(--text-primary)' }}>PAY</span><span style={{ color: 'var(--brand-accent)' }}>SPLIT</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'var(--text-muted)', fontWeight: 500, transition: 'color 0.2s' }} className="nav-link">
            Log In
          </Link>
          <Link href="/register" className="primary-button" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ paddingTop: '6rem' }}>
        <h1 className="hero-title">
          Split expenses. <br /> <span>Without the math.</span>
        </h1>
        <p className="hero-copy">
          The most elegant way to track shared costs with friends, roommates, and travel buddies. Built for the modern web with a premium, seamless experience.
        </p>
        
        <div className="hero-actions">
          <Link href="/register" className="primary-button">
            Get Started Free
          </Link>
          <Link href="#seo-section" className="secondary-button">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Everything you need to stay balanced</h2>
        <div className="features-grid">
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/O/O/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="feature-title">Smart Splitting</h3>
            <p className="feature-desc">Easily divide costs evenly, by exact amounts, or by percentages. We do all the heavy lifting.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/O/O/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="feature-title">Group Tracking</h3>
            <p className="feature-desc">Create groups for apartments, trips, or events. Keep all related expenses organized in one place.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/O/O/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Settle Up Swiftly</h3>
            <p className="feature-desc">Record cash or digital payments to instantly update balances and keep your friendships intact.</p>
          </div>

        </div>
      </section>

      {/* SEO Optimized Content Section */}
      <section id="seo-section" className="seo-section" style={{ maxWidth: '800px', margin: '0 auto 6rem', padding: '0 2rem', zIndex: 1, position: 'relative', color: 'var(--text-muted)', lineHeight: 1.8 }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit, "Outfit", sans-serif)' }}>The Ultimate Bill Splitting App for Shared Expenses</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Whether you are splitting rent with roommates, dividing a dinner bill, or tracking travel costs across the globe, <strong>PaySplit</strong> is the ultimate shared expense tracker. Managing shared finances shouldn't ruin relationships. Our intuitive bill splitting calculator ensures everyone pays their fair share without the awkward conversations.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          Unlike traditional spreadsheets or complicated ledger systems, PaySplit offers a seamless, premium dark-mode interface designed for the modern web. You can instantly see who owes who, record payments, and keep a running total of IOUs. It is the perfect Splitwise alternative for users who value minimalist design, speed, and privacy.
        </p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', margin: '2rem 0 1rem', fontFamily: 'var(--font-outfit, "Outfit", sans-serif)' }}>How PaySplit Simplifies Your Life</h3>
        <ul style={{ paddingLeft: '1.5rem', display: 'grid', gap: '1rem' }}>
          <li><strong>Roommate Expenses:</strong> Never argue over utilities, rent, or groceries again. Simply log the shared cost and let PaySplit calculate the balances.</li>
          <li><strong>Group Travel Trips:</strong> Traveling with a group? Track flights, hotels, and dinners in a single shared dashboard, even across multiple currencies.</li>
          <li><strong>Couples & Relationships:</strong> A stress-free way to manage shared household costs without needing a joint bank account.</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--text-primary)' }}>PAY</span><span style={{ color: 'var(--brand-accent)' }}>SPLIT</span>
        </div>
        <p>© {new Date().getFullYear()} PaySplit Inc. Crafted with precision for a premium experience.</p>
      </footer>
    </main>
  );
}
