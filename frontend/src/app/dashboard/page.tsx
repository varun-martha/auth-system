import { DashboardProfileCard } from "@/components/auth/DashboardProfileCard";
import { requireAuth } from "@/lib/require-auth";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div
      className="dashboard-page"
      style={{ display: "flex", padding: 0, alignItems: "stretch" }}
    >
      <Sidebar />
      <main className="dashboard-main">
        <section className="dashboard-shell">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.username || user?.email || "User"}</h1>
          </div>

          <div className="dashboard-grid">
            {/* Left Column: Profile & Balance */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              <div className="dashboard-card">
                <div className="balance-label">Total Balance</div>
                <div className="balance-amount">+$142.50</div>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    margin: 0
                  }}
                >
                  You are owed overall
                </p>
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
              <button
                className="primary-button"
                style={{ width: "100%", marginTop: "2rem" }}
              >
                Add an expense
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
