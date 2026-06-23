import { headers } from "next/headers";
import { buildApiUrl } from "@/services/auth-api.service";

export async function getDashboardSummary() {
  const requestHeaders = headers();
  const cookieHeader = (await requestHeaders).get("cookie");

  const response = await fetch(buildApiUrl("/users/me/dashboard"), {
    method: "GET",
    cache: "no-store",
    headers: cookieHeader
      ? {
          cookie: cookieHeader
        }
      : undefined
  });

  if (!response.ok) {
    throw new Error("Unable to load dashboard summary.");
  }

  const data = await response.json();
  return data.summary;
}
