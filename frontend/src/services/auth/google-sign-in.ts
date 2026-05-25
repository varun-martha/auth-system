"use client";

import { buildApiUrl } from "@/services/auth-api.service";
import { fetchJson } from "@/lib/fetcher";
import type { AuthSuccessResponse } from "@/types/auth/register";

export async function loginWithGoogle(
  idToken: string
): Promise<AuthSuccessResponse> {
  return fetchJson<AuthSuccessResponse>(buildApiUrl("/auth/google"), {
    method: "POST",
    body: JSON.stringify({ idToken })
  });
}
