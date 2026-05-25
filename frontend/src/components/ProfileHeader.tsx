"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { AvatarEditModal } from "./AvatarEditModal";

interface ProfileHeaderProps {
  user: {
    username: string;
    email: string;
    avatarUrl?: string;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="dashboard-card"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <div
          style={{
            position: "relative",
            cursor: "pointer",
            display: "inline-block"
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <Avatar url={user.avatarUrl} size={100} />

          <div className="edit-avatar-badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </div>
        </div>

        <div>
          <h2 style={{ margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>
            {user.username}
          </h2>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>{user.email}</p>
        </div>
      </div>

      {isModalOpen && (
        <AvatarEditModal
          currentAvatar={user.avatarUrl}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
