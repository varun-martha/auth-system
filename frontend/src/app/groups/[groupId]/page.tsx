"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { AddExpenseModal } from "@/components/groups/AddExpenseModal";
import { AddMembersModal } from "@/components/groups/AddMembersModal";
import { SettleUpModal } from "@/components/groups/SettleUpModal";
import { ExpenseList } from "@/components/groups/ExpenseList";
import { BalanceSummary } from "@/components/groups/BalanceSummary";
import { api } from "@/services/api";
import { getFrontendEnv } from "@/lib/env";
import { io, Socket } from "socket.io-client";
import { Group, Expense, GroupBalance } from "@/types/groups.types";
import "@/styles/groups.css";

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<GroupBalance[]>([]);
  const [isSettled, setIsSettled] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [groupData, expensesData, balancesData, currentUserData] = await Promise.all([
        api.getGroup(groupId),
        api.getGroupExpenses(groupId),
        api.getGroupBalances(groupId),
        api.getCurrentUser().catch(() => null),
      ]);
      setGroup(groupData.group);
      setExpenses(expensesData.expenses || []);
      setBalances(balancesData.balances || []);
      setIsSettled(balancesData.isSettled ?? true);
      if (currentUserData) setCurrentUserId(currentUserData.user?.id || currentUserData.user?._id || "");
    } catch (err: any) {
      if (!isBackground) setError(err.message || "Failed to load group.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    if (!groupId) return;
    loadData();
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || getFrontendEnv().apiBaseUrl.replace("/api/v1", "");
    const socket: Socket = io(socketUrl, { withCredentials: true, transports: ["websocket", "polling"] });
    socket.on("expense_update", (data: any) => { if (data?.groupId === groupId || !data?.groupId) loadData(true); });
    socket.on("group_update", (data: any) => { if (data?.groupId === groupId || !data?.groupId) loadData(true); });
    return () => { socket.disconnect(); };
  }, [groupId]);

  if (loading) {
    return (
      <div style={{ display: "flex", padding: 0, alignItems: "stretch", minHeight: "100vh" }}>
        <Sidebar />
        <div className="groups-page groups-main" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ animation: "spin 1s linear infinite", width: 40, height: 40, border: "3px solid var(--border-subtle)", borderTopColor: "var(--brand-accent)", borderRadius: "50%" }} />
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div style={{ display: "flex", padding: 0, alignItems: "stretch", minHeight: "100vh" }}>
        <Sidebar />
        <div className="groups-page groups-main" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
            <h2>{error || "Group not found"}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", padding: 0, alignItems: "stretch", minHeight: "100vh" }}>
      <Sidebar />
      <main className="groups-page groups-main" style={{ flex: 1, overflowY: "auto" }}>
        <div className="groups-shell">
          <div className="group-detail-header">
            <div>
              <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem" }}>{group.name}</h1>
              {group.description && <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>{group.description}</p>}
              <div className="group-member-avatars" style={{ marginTop: "0.75rem" }}>
                {group.members.slice(0, 6).map((m) => (
                  <div key={m.id} className="group-member-avatar" title={`@${m.username}`}>{m.username.slice(0, 2).toUpperCase()}</div>
                ))}
                {group.memberCount > 6 && <div className="group-member-avatar" style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-muted)" }}>+{group.memberCount - 6}</div>}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignSelf: "flex-start" }}>
              {!group.isDirect && (
                <button id="open-add-members" className="btn-secondary" onClick={() => setShowAddMembers(true)}>Add Members</button>
              )}
              <button id="open-settle-up" className="btn-secondary" style={{ color: "var(--brand-accent)", borderColor: "var(--brand-accent)" }} onClick={() => setShowSettleUp(true)}>Settle Up</button>
              <button id="open-add-expense" className="btn-primary" onClick={() => setShowAddExpense(true)}>+ Add Expense</button>
            </div>
          </div>
          <div className="group-detail-grid">
            <div>
              <BalanceSummary balances={balances} isSettled={isSettled} currentUserId={currentUserId} />
            </div>
            <div>
              <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>Expenses</h2>
              <ExpenseList expenses={expenses} onAddExpense={() => setShowAddExpense(true)} onEditExpense={(exp) => setEditingExpense(exp)} />
            </div>
          </div>
        </div>
        {(showAddExpense || editingExpense) && group && (
          <AddExpenseModal 
            groupId={groupId} 
            members={group.members} 
            currentUserId={currentUserId} 
            existingExpense={editingExpense || undefined}
            onClose={() => { setShowAddExpense(false); setEditingExpense(null); }} 
            onAdded={() => loadData()} 
          />
        )}
        {showAddMembers && !group.isDirect && (
          <AddMembersModal groupId={groupId} existingMemberIds={group.members.map((m) => m.id)} onClose={() => setShowAddMembers(false)} onAdded={() => loadData()} />
        )}
        {showSettleUp && group && (
          <SettleUpModal
            groupId={groupId}
            members={group.members}
            onClose={() => setShowSettleUp(false)}
            onSettled={() => loadData()}
          />
        )}
      </main>
    </div>
  );
}
