"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "./Avatar";

export function AvatarEditModal({
  currentAvatar,
  onClose
}: {
  currentAvatar?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [previewAvatar, setPreviewAvatar] = useState(
    currentAvatar ||
      `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random().toString(36).substring(2, 10)}`
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const generateNew = () => {
    setPreviewAvatar(
      `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random().toString(36).substring(2, 10)}`
    );
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1"}/users/me/avatar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ avatarUrl: previewAvatar })
        }
      );

      if (res.ok) {
        router.refresh();
        onClose();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update avatar");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dashboard-card"
        style={{
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          textAlign: "center"
        }}
      >
        <button
          onClick={onClose}
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

        <h3
          style={{
            margin: "0 0 1.5rem 0",
            color: "var(--text-primary)",
            fontSize: "1.5rem",
            fontWeight: 700
          }}
        >
          Customize Your Avatar
        </h3>

        <div
          style={{
            marginBottom: "2.5rem",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Avatar url={previewAvatar} size={150} />
        </div>

        <button
          onClick={generateNew}
          className="secondary-button"
          style={{
            marginBottom: "1rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--brand-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle
              cx="12"
              cy="12"
              r="3"
              fill="var(--brand-accent)"
              opacity="0.3"
            />
          </svg>
          <span style={{ fontWeight: 500 }}>Generate Magic Avatar</span>
        </button>

        <button
          onClick={handleUpdate}
          className="primary-button"
          style={{ width: "100%" }}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Avatar"}
        </button>
      </div>
    </div>
  );
}
