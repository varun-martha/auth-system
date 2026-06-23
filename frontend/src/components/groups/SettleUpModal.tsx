import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { GroupMember } from "@/types/groups.types";
import { getCurrentUser } from "@/services/auth/get-current-user";

interface SettleUpModalProps {
  groupId: string;
  members: GroupMember[];
  onClose: () => void;
  onSettled: () => void;
  defaultPayerId?: string;
  defaultReceiverId?: string;
  defaultAmount?: number;
}

export function SettleUpModal({ groupId, members, onClose, onSettled, defaultPayerId, defaultReceiverId, defaultAmount }: SettleUpModalProps) {
  const [payerId, setPayerId] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [amount, setAmount] = useState<string>(defaultAmount ? (defaultAmount / 100).toFixed(2) : "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Try to set sensible defaults
    const initializeDefaults = async () => {
      try {
        const { user } = await api.getCurrentUser();
        if (defaultPayerId) {
          setPayerId(defaultPayerId);
        } else {
          setPayerId(user.id); // Assume current user is paying by default
        }

        if (defaultReceiverId) {
          setReceiverId(defaultReceiverId);
        } else {
          // If only 2 members in group, pick the other one
          const otherMember = members.find(m => m.id !== user.id);
          if (members.length === 2 && otherMember) {
            setReceiverId(otherMember.id);
          }
        }
      } catch (err) {
        console.error("Failed to get current user for defaults", err);
      }
    };
    initializeDefaults();
  }, [defaultPayerId, defaultReceiverId, members]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!payerId || !receiverId) {
      setError("Please select both who is paying and who is receiving.");
      return;
    }

    if (payerId === receiverId) {
      setError("You cannot settle up with yourself.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: "Settlement",
        totalAmount: Math.round(parsedAmount * 100),
        currency: "INR",
        paidById: payerId,
        splitMethod: "settlement" as const,
        date: new Date(date).toISOString(),
        splits: [{ userId: receiverId, amount: Math.round(parsedAmount * 100) }],
      };

      await api.createExpense(groupId, payload);
      onSettled();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to record settlement.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--brand-accent)" }}>
          Settle Up
        </h3>
        
        {error && (
          <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "#ef4444", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="modal-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="modal-label">Who paid?</label>
              <select 
                className="modal-input" 
                value={payerId} 
                onChange={(e) => setPayerId(e.target.value)}
                required
              >
                <option value="">Select person</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.username}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "0.5rem" }}>
              <span style={{ color: "var(--text-muted)" }}>➔</span>
            </div>

            <div className="modal-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="modal-label">Who received?</label>
              <select 
                className="modal-input" 
                value={receiverId} 
                onChange={(e) => setReceiverId(e.target.value)}
                required
              >
                <option value="">Select person</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.username}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Amount</label>
            <div className="modal-amount-prefix">
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                className="modal-amount-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Date</label>
            <input
              type="date"
              required
              className="modal-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button type="button" className="secondary-button" onClick={onClose} style={{ flex: 1 }} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" style={{ flex: 1 }} disabled={loading}>
              {loading ? "Saving..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
