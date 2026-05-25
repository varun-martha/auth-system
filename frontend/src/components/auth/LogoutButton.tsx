"use client";

import { useRouter } from "next/navigation";

import { setCachedUser } from "@/lib/session";
import { logoutUser } from "@/services/auth/logout-user";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    setCachedUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        borderRadius: "6px",
        background: "transparent",
        border: "none",
        color: "var(--text-muted)",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        fontSize: "1rem",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--text-primary)";
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--text-muted)";
        e.currentTarget.style.backgroundColor = "transparent";
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
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      Sign out
    </button>
  );
}
