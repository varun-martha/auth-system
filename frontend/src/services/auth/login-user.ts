"use client";

import { buildApiUrl } from "@/services/auth-api.service";
import { fetchJson } from "@/lib/fetcher";
import type { AuthSuccessResponse, LoginPayload } from "@/types/auth/register";

export async function loginUser(payload: LoginPayload): Promise<AuthSuccessResponse> {
  return fetchJson<AuthSuccessResponse>(buildApiUrl("/auth/login"), {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
