import { redirect } from "next/navigation";

import { getCurrentUser } from "@/services/auth/get-current-user";

export async function requireAuth() {
  try {
    const response = await getCurrentUser();
    return response.user;
  } catch {
    redirect("/login");
  }
}
