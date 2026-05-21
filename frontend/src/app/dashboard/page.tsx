import { DashboardProfileCard } from "@/components/auth/DashboardProfileCard";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireAuth } from "@/lib/require-auth";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <main className="dashboard-page">
      <nav style={{ width: '100%', maxWidth: '1000px', margin: '0 auto 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'relative' }}>
        <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.1em' }}>
          <span style={{ color: 'var(--text-primary)' }}>PAY</span><span style={{ color: 'var(--brand-accent)' }}>SPLIT</span>
        </Link>
        <LogoutButton />
      </nav>

      <section className="dashboard-shell">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || user?.username || 'User'}</h1>
        </div>
        
        <div className="dashboard-grid">
          {/* Left Column: Profile & Balance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="dashboard-card">
              <div className="balance-label">Total Balance</div>
              <div className="balance-amount">+$142.50</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>You are owed overall</p>
            </div>
            
            <div className="dashboard-card">
              <h2>Your Profile</h2>
              <DashboardProfileCard user={user} />
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="dashboard-card">
            <h2>Recent Activity</h2>
            <ul className="activity-list">
              <li className="activity-item">
                <div className="activity-desc">Dinner at Mario's</div>
                <div className="activity-amount positive">+$45.00</div>
              </li>
              <li className="activity-item">
                <div className="activity-desc">Internet Bill</div>
                <div className="activity-amount negative">-$30.00</div>
              </li>
              <li className="activity-item">
                <div className="activity-desc">Uber to Airport</div>
                <div className="activity-amount positive">+$12.50</div>
              </li>
              <li className="activity-item">
                <div className="activity-desc">Groceries</div>
                <div className="activity-amount negative">-$85.20</div>
              </li>
            </ul>
            <button className="primary-button" style={{ width: '100%', marginTop: '2rem' }}>
              Add an expense
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
