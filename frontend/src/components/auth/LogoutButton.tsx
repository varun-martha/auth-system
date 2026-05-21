"use client";

import { useRouter } from "next/navigation";

import { setCachedUser } from "@/lib/session";
import { logoutUser } from "@/services/auth/logout-user";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    setCachedUser(null);
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button className="secondary-button" onClick={handleLogout} type="button">
      Sign out
    </button>
  );
}
