import { requireAuth } from "@/lib/require-auth";
import { getDashboardSummary } from "@/services/dashboard/get-dashboard-summary";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuth();
  const summary = await getDashboardSummary();

  return (
    <div
      className="dashboard-page"
      style={{ display: "flex", padding: 0, alignItems: "stretch" }}
    >
      <Sidebar />
      <main className="dashboard-main">
        <section className="dashboard-shell">
          <div className="dashboard-header" style={{ borderBottom: "none", paddingBottom: 0, marginBottom: "2rem" }}>
            <div className="animate-slide-up dashboard-welcome" style={{ animationDelay: "0.05s" }}>
              <p className="dashboard-welcome-subtitle">Welcome back</p>
              <h1 className="dashboard-welcome-title">
                {user?.username || user?.email?.split('@')[0] || "User"}.
              </h1>
              <p className="dashboard-welcome-text">
                Here is a quick overview of your current balance and recent expenses across all your groups.
              </p>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Left Column: Profile & Balance */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              <div className="dashboard-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
                <div className="balance-label">Total Balance</div>
                <div className={`balance-amount ${summary.totalBalance >= 0 ? "positive" : "negative"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {summary.totalBalance >= 0 ? "+" : "-"}₹{Math.abs(summary.totalBalance / 100).toFixed(2)}
                </div>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.95rem",
                    margin: 0
                  }}
                >
                  {summary.totalBalance >= 0 ? "You are owed overall" : "You owe overall"}
                </p>
              </div>
            </div>

            {/* Right Column: Recent Activity */}
            <div className="dashboard-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <h2>Recent Activity</h2>
              {summary.recentActivity && summary.recentActivity.length > 0 ? (
                <ul className="activity-list">
                  {summary.recentActivity.map((activity: any, index: number) => {
                    const isCredit = activity.paidById === user.id;
                    return (
                      <li key={activity.id} className="activity-item animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                        <div className="activity-desc">
                          <div className="activity-title">{activity.title}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{new Date(activity.date).toLocaleDateString()}</div>
                        </div>
                        <div className={`activity-amount ${isCredit ? "positive" : ""}`}>
                          {isCredit ? "+" : ""}₹{(activity.totalAmount / 100).toFixed(2)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No recent activity found.
                </div>
              )}
              <Link href="/groups" passHref style={{ display: "block", width: "100%", marginTop: "2rem" }}>
                <button
                  className="primary-button hover-lift"
                  style={{ width: "100%" }}
                >
                  View Groups
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
