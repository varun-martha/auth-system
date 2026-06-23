"use client";
import { useState } from "react";
import { api } from "@/services/api";
import { GroupMember, Expense } from "@/types/groups.types";

interface Props {
  groupId?: string;
  members: GroupMember[];
  currentUserId: string;
  existingExpense?: Expense;
  onClose: () => void;
  onAdded: () => void;
}

export function AddExpenseModal({ groupId, members, currentUserId, existingExpense, onClose, onAdded }: Props) {
  const [title, setTitle] = useState(existingExpense?.title || "");
  const [amount, setAmount] = useState(existingExpense ? (existingExpense.totalAmount / 100).toString() : "");
  const [date, setDate] = useState(existingExpense ? existingExpense.date.split("T")[0] : new Date().toISOString().split("T")[0]);
  const [paidById, setPaidById] = useState(existingExpense?.paidById || currentUserId);
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom" | "percentage">(existingExpense?.splitMethod || "equal");
  
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>(() => {
    if (existingExpense?.splitMethod === "custom") {
      return existingExpense.splits.reduce((acc, s) => ({ ...acc, [s.userId]: (s.amount / 100).toString() }), {});
    }
    return {};
  });
  
  const [percentages, setPercentages] = useState<Record<string, string>>(() => {
    if (existingExpense?.splitMethod === "percentage") {
      return existingExpense.splits.reduce((acc, s) => ({ ...acc, [s.userId]: (s.percentage || 0).toString() }), {});
    }
    return {};
  });
  
  const [includedMemberIds, setIncludedMemberIds] = useState<Set<string>>(() => {
    if (existingExpense && existingExpense.splits) {
      return new Set(existingExpense.splits.map((s) => s.userId));
    }
    return new Set(members.map((m) => m.id));
  });

  const toggleMember = (id: string) => {
    setIncludedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalAmountCents = Math.round(parseFloat(amount || "0") * 100);
  const includedMembersCount = includedMemberIds.size;
  const equalShare = includedMembersCount > 0 ? totalAmountCents / includedMembersCount : 0;
  const customTotal = members.filter(m => includedMemberIds.has(m.id)).reduce((sum, m) => sum + Math.round(parseFloat(customAmounts[m.id] || "0") * 100), 0);
  const percentTotal = members.filter(m => includedMemberIds.has(m.id)).reduce((sum, m) => sum + parseFloat(percentages[m.id] || "0"), 0);

  const isSplitValid = (() => {
    if (!title.trim() || !amount || totalAmountCents <= 0) return false;
    if (includedMembersCount === 0) return false;
    if (splitMethod === "custom") return Math.abs(customTotal - totalAmountCents) <= 1;
    if (splitMethod === "percentage") return Math.abs(percentTotal - 100) < 0.01;
    return true;
  })();

  const handleSubmit = async () => {
    if (!isSplitValid) return;
    setIsSubmitting(true);
    setError("");
    try {
      let splits: any[] | undefined;
      if (splitMethod === "custom") {
        splits = members.filter(m => includedMemberIds.has(m.id)).map((m) => ({ userId: m.id, amount: Math.round(parseFloat(customAmounts[m.id] || "0") * 100) }));
      } else if (splitMethod === "percentage") {
        splits = members.filter(m => includedMemberIds.has(m.id)).map((m) => ({ userId: m.id, percentage: parseFloat(percentages[m.id] || "0") }));
      } else if (splitMethod === "equal") {
        splits = members.filter(m => includedMemberIds.has(m.id)).map((m) => ({ userId: m.id }));
      }
      const payload = { title: title.trim(), totalAmount: totalAmountCents, currency: "INR", paidById, splitMethod, date, splits };
      if (existingExpense && groupId) {
        await api.updateExpense(groupId, existingExpense.id, payload);
      } else if (groupId) {
        await api.createExpense(groupId, payload);
      } else {
        const friendUserId = members.find(m => m.id !== currentUserId)?.id;
        await api.createDirectSplit({ ...payload, friendUserId });
      }
      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <h3 style={{ margin: "0 0 1.5rem 0", fontFamily: "Outfit, sans-serif" }}>{existingExpense ? "Edit Expense" : "Add Expense"}</h3>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}
        <div className="modal-form-group">
          <label className="modal-label">Title *</label>
          <input id="expense-title" className="modal-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dinner at Mario's" maxLength={100} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="modal-form-group">
            <label className="modal-label">Amount (₹) *</label>
            <input id="expense-amount" className="modal-input" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" style={{ fontSize: "1.1rem", fontWeight: 600 }} />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Date *</label>
            <input id="expense-date" className="modal-input" type="date" value={date} max={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Paid by</label>
          <select id="expense-payer" className="modal-input" value={paidById} onChange={(e) => setPaidById(e.target.value)} style={{ cursor: "pointer" }}>
            {members.map((m) => <option key={m.id} value={m.id}>@{m.username}{m.id === currentUserId ? " (you)" : ""}</option>)}
          </select>
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Split method</label>
          <div className="split-toggle">
            {(["equal", "custom", "percentage"] as const).map((method) => (
              <button key={method} id={`split-method-${method}`} className={`split-toggle-btn${splitMethod === method ? " active" : ""}`} onClick={() => setSplitMethod(method)}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {splitMethod === "equal" && totalAmountCents > 0 && (
          <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", padding: "1rem", marginBottom: "1rem" }}>
            {members.map((m) => (
              <div key={m.id} className="split-member-row">
                <label style={{ flex: 1, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: includedMemberIds.has(m.id) ? "inherit" : "var(--text-muted)" }}>
                  <input type="checkbox" checked={includedMemberIds.has(m.id)} onChange={() => toggleMember(m.id)} />
                  @{m.username}
                </label>
                <div style={{ color: includedMemberIds.has(m.id) ? "var(--brand-accent)" : "var(--text-muted)", fontWeight: includedMemberIds.has(m.id) ? 600 : 400 }}>
                  ₹{includedMemberIds.has(m.id) ? (equalShare / 100).toFixed(2) : "0.00"}
                </div>
              </div>
            ))}
          </div>
        )}
        {splitMethod === "custom" && (
          <div style={{ marginBottom: "1rem" }}>
            {members.map((m) => (
              <div key={m.id} className="split-member-row">
                <label style={{ flex: 1, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: includedMemberIds.has(m.id) ? "inherit" : "var(--text-muted)" }}>
                  <input type="checkbox" checked={includedMemberIds.has(m.id)} onChange={() => toggleMember(m.id)} />
                  @{m.username}
                </label>
                {includedMemberIds.has(m.id) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>₹</span>
                    <input id={`custom-amount-${m.id}`} className="split-member-input" type="number" min="0" step="0.01" value={customAmounts[m.id] || ""} onChange={(e) => setCustomAmounts((prev) => ({ ...prev, [m.id]: e.target.value }))} placeholder="0.00" />
                  </div>
                )}
              </div>
            ))}
            <div className={`split-total-indicator ${Math.abs(customTotal - totalAmountCents) <= 1 ? "match" : "mismatch"}`}>
              Total: ₹{(customTotal / 100).toFixed(2)} / ₹{(totalAmountCents / 100).toFixed(2)}
            </div>
          </div>
        )}
        {splitMethod === "percentage" && (
          <div style={{ marginBottom: "1rem" }}>
            {members.map((m) => (
              <div key={m.id} className="split-member-row">
                <label style={{ flex: 1, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: includedMemberIds.has(m.id) ? "inherit" : "var(--text-muted)" }}>
                  <input type="checkbox" checked={includedMemberIds.has(m.id)} onChange={() => toggleMember(m.id)} />
                  @{m.username}
                </label>
                {includedMemberIds.has(m.id) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <input id={`pct-amount-${m.id}`} className="split-member-input" type="number" min="0" max="100" step="0.01" value={percentages[m.id] || ""} onChange={(e) => setPercentages((prev) => ({ ...prev, [m.id]: e.target.value }))} placeholder="0" />
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>%</span>
                  </div>
                )}
              </div>
            ))}
            <div className={`split-total-indicator ${Math.abs(percentTotal - 100) < 0.01 ? "match" : "mismatch"}`}>
              Total: {percentTotal.toFixed(1)}% / 100%
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
          <button id="expense-cancel" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button id="expense-submit" className="btn-primary" onClick={handleSubmit} disabled={isSubmitting || !isSplitValid}>{isSubmitting ? "Saving..." : existingExpense ? "Save Changes" : "Add Expense"}</button>
        </div>
      </div>
    </div>
  );
}
