"use client";

import { buildApiUrl } from "@/services/auth-api.service";
import { fetchJson } from "@/lib/fetcher";
import type {
  AuthSuccessResponse,
  RegisterPayload
} from "@/types/auth/register";

export async function registerUser(
  payload: RegisterPayload
): Promise<AuthSuccessResponse> {
  return fetchJson<AuthSuccessResponse>(buildApiUrl("/auth/register"), {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
