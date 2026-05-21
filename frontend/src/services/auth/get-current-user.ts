import { headers } from "next/headers";

import { buildApiUrl } from "@/services/auth-api.service";
import type { UserSummaryResponse } from "@/types/auth/register";

export async function getCurrentUser(): Promise<UserSummaryResponse> {
  const requestHeaders = headers();
  const cookieHeader = (await requestHeaders).get("cookie");

  const response = await fetch(buildApiUrl("/auth/me"), {
    method: "GET",
    cache: "no-store",
    headers: cookieHeader
      ? {
          cookie: cookieHeader
        }
      : undefined
  });

  if (!response.ok) {
    throw new Error("Unable to load the authenticated user.");
  }

  return response.json() as Promise<UserSummaryResponse>;
}
