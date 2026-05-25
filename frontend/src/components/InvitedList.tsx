"use client";

import { useEffect, useState } from "react";
import { getInvites } from "@/services/invite.service";

export function InvitedList({
  refreshTrigger = 0
}: {
  refreshTrigger?: number;
}) {
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvites() {
      try {
        const data = await getInvites();
        setInvites(data.invites || []);
      } catch (err) {
        console.error("Failed to load invites", err);
      } finally {
        setLoading(false);
      }
    }
    loadInvites();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <p style={{ color: "var(--text-muted)" }}>Loading your invites...</p>
    );
  }

  if (invites.length === 0) {
    return (
      <div
        className="dashboard-card"
        style={{ padding: "2rem", textAlign: "center", borderStyle: "dashed" }}
      >
        <p style={{ color: "var(--text-muted)" }}>
          You haven't invited anyone yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="dashboard-card"
      style={{ padding: "0", overflow: "hidden" }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              borderBottom: "1px solid var(--border-subtle)",
              textAlign: "left",
              background: "rgba(255, 255, 255, 0.03)"
            }}
          >
            <th style={{ padding: "1rem", color: "var(--text-muted)" }}>
              Email
            </th>
            <th style={{ padding: "1rem", color: "var(--text-muted)" }}>
              Status
            </th>
            <th style={{ padding: "1rem", color: "var(--text-muted)" }}>
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite) => (
            <tr
              key={invite._id}
              style={{
                borderBottom: "1px solid var(--border-subtle)",
                transition: "background 0.2s"
              }}
            >
              <td style={{ padding: "1rem", color: "var(--text-primary)" }}>
                {invite.inviteeEmail}
              </td>
              <td style={{ padding: "1rem" }}>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "999px",
                    fontSize: "0.85rem",
                    color:
                      invite.status === "Joined"
                        ? "#10b981"
                        : "#f59e0b",
                    backgroundColor:
                      invite.status === "Joined"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(245, 158, 11, 0.15)",
                    border: `1px solid ${
                      invite.status === "Joined"
                        ? "rgba(16, 185, 129, 0.4)"
                        : "rgba(245, 158, 11, 0.4)"
                    }`,
                    fontWeight: 600,
                    textShadow: invite.status === "Joined" ? "0 0 10px rgba(16, 185, 129, 0.4)" : "none"
                  }}
                >
                  {invite.status}
                </span>
              </td>
              <td
                style={{
                  padding: "1rem",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem"
                }}
              >
                {new Date(invite.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
