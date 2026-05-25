"use client";

import { useState, useEffect } from "react";
import { InvitedList } from "./InvitedList";
import { InviteForm } from "./InviteForm";

export function ProfileInvitesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <div style={{ marginTop: "3rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "var(--text-primary)",
            fontSize: "1.5rem"
          }}
        >
          My Invites
        </h3>
        <button
          className="primary-button"
          onClick={() => setIsModalOpen(true)}
          style={{ padding: "0.5rem 1.5rem" }}
        >
          Invite a Friend
        </button>
      </div>

      <InvitedList refreshTrigger={refreshTrigger} />

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{ width: "100%", maxWidth: "600px", position: "relative" }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "1.2rem",
                padding: "0.25rem",
                lineHeight: 1
              }}
              title="Close"
            >
              ✕
            </button>
            <InviteForm
              onSuccess={() => {
                setRefreshTrigger((r) => r + 1);
                // Optionally auto-close after a short delay so they can see the success message
                setTimeout(() => setIsModalOpen(false), 1500);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
