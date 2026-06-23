"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/services/api";
import "@/styles/dashboard.css";
import "@/styles/groups.css";
import "@/styles/friends.css";

const methodLabel: Record<string, string> = { equal: "Split equally", custom: "Custom split", percentage: "By percentage", settlement: "Settlement" };

export default function ActivityPage() {
  const [activity, setActivity] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [activityData, userData] = await Promise.all([
          api.getActivityHistory(100),
          api.getCurrentUser().catch(() => null)
        ]);
        setActivity(activityData.activity || []);
        if (userData) {
          setCurrentUser(userData.user || userData);
        }
      } catch (err: any) {
        setError("Failed to load activity history");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", padding: 0, alignItems: "stretch", minHeight: "100vh" }}>
        <Sidebar />
        <main className="friends-page dashboard-main" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ animation: "spin 1s linear infinite", width: 40, height: 40, border: "3px solid var(--border-subtle)", borderTopColor: "var(--brand-accent)", borderRadius: "50%" }} />
        </main>
      </div>
    );
  }

  // Group by month
  const groupedActivity = activity.reduce((acc, item) => {
    const dateStr = new Date(item.date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div style={{ display: "flex", padding: 0, alignItems: "stretch", minHeight: "100vh" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ flex: 1, overflowY: "auto" }}>
        <section className="dashboard-shell" style={{ maxWidth: "800px" }}>
          <div className="dashboard-header" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "2rem", marginBottom: "2rem" }}>
            <div className="animate-slide-up dashboard-welcome" style={{ animationDelay: "0.05s" }}>
              <p className="dashboard-welcome-subtitle">Your History</p>
              <h1 className="dashboard-welcome-title">
                Activity Feed.
              </h1>
              <p className="dashboard-welcome-text">
                A chronological ledger of every expense, split, and settlement you've ever been a part of.
              </p>
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
            {error && <div style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</div>}
            
            {activity.length === 0 && !error ? (
              <div className="empty-state" style={{ textAlign: "center", padding: "4rem 0" }}>
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: "0 auto 1rem", opacity: 0.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 style={{ color: "var(--text-primary)" }}>No activity yet</h3>
                <p style={{ color: "var(--text-muted)" }}>Your expenses and settlements will appear here.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {Object.entries(groupedActivity).map(([month, items]) => (
                  <div key={month}>
                    <h3 style={{ fontSize: "1rem", color: "var(--brand-accent)", margin: "0 0 1rem 0", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {month}
                    </h3>
                    <ul className="activity-list">
                      {(items as any[]).map((item, i) => {
                        const isSettlement = item.splitMethod === "settlement";
                        const isPayer = currentUser && currentUser.id === item.paidById;
                        const isCredit = isSettlement ? !isPayer : isPayer;

                        if (isSettlement) {
                          const title = isPayer ? "You paid someone" : `@${item.paidByName} paid you`;
                          return (
                            <li key={item.id} className="activity-item animate-fade-in" style={{ animationDelay: `${(i % 10) * 0.05}s`, borderLeft: "3px solid var(--brand-accent)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-accent)", flexShrink: 0 }}>
                                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                </div>
                                <div className="activity-desc" style={{ marginRight: 0 }}>
                                  <div className="activity-title" style={{ color: "var(--brand-accent)" }}>{title}</div>
                                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{item.groupName} • {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                                </div>
                              </div>
                              <div className={`activity-amount ${isCredit ? "positive" : "negative"}`} style={{ marginLeft: "1rem" }}>
                                {isCredit ? "+" : "-"}₹{(item.totalAmount / 100).toFixed(2)}
                              </div>
                            </li>
                          );
                        }

                        const title = isPayer ? `You paid for ${item.title}` : `@${item.paidByName} paid for ${item.title}`;
                        return (
                          <li key={item.id} className="activity-item animate-fade-in" style={{ animationDelay: `${(i % 10) * 0.05}s` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
                              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", flexShrink: 0 }}>
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                              </div>
                              <div className="activity-desc" style={{ marginRight: 0 }}>
                                  <div className="activity-title">{title}</div>
                                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{item.groupName} • {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                                </div>
                              </div>
                              <div className={`activity-amount ${isCredit ? "positive" : "negative"}`} style={{ marginLeft: "1rem" }}>
                                {isCredit ? "+" : "-"}₹{(item.totalAmount / 100).toFixed(2)}
                              </div>
                            </li>
                          );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
