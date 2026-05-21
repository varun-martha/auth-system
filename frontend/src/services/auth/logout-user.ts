"use client";

import { buildApiUrl } from "@/services/auth-api.service";

export async function logoutUser(): Promise<void> {
  await fetch(buildApiUrl("/auth/logout"), {
    method: "POST",
    credentials: "include"
  });
}
