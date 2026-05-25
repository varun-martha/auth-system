"use client";

import { useState } from "react";
import { sendInvite } from "@/services/invite.service";

export function InviteForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await sendInvite(email);
      setMessage({ type: "success", text: response.message });
      setEmail("");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to send invite"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card invite-form-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem"
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "var(--brand-accent)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
        </div>
        <h3
          style={{
            margin: 0,
            color: "var(--text-primary)",
            fontSize: "1.5rem",
            fontWeight: 600
          }}
        >
          Invite a Friend
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <div>
          <label
            htmlFor="invite-email"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              color: "var(--text-muted)"
            }}
          >
            Email Address
          </label>
          <input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            required
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "var(--text-primary)",
              outline: "none"
            }}
          />
        </div>
        <button
          type="submit"
          className="primary-button"
          disabled={loading || !email}
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            width: "100%",
            opacity: loading || !email ? 0.5 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "all 0.3s ease"
          }}
        >
          {loading ? (
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <svg
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              Sending...
            </span>
          ) : (
            <>
              Send Invite
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </>
          )}
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "6px",
            fontSize: "0.9rem",
            backgroundColor:
              message.type === "success"
                ? "var(--brand-accent-glow)"
                : "rgba(239, 68, 68, 0.2)",
            color:
              message.type === "success" ? "var(--brand-accent)" : "#ef4444",
            border: `1px solid ${
              message.type === "success" ? "var(--brand-accent)" : "#ef4444"
            }`
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {message.type === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            <span style={{ fontWeight: 500 }}>{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
