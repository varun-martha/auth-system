import { fetchJson } from "@/lib/fetcher";
import { buildApiUrl } from "@/services/auth-api.service";

export async function sendInvite(
  email: string
): Promise<{ success: boolean; message: string }> {
  return fetchJson<{ success: boolean; message: string }>(
    buildApiUrl("/invites"),
    {
      method: "POST",
      body: JSON.stringify({ email })
    }
  );
}

export async function getInvites(): Promise<{ invites: any[] }> {
  return fetchJson<{ invites: any[] }>(buildApiUrl("/invites"), {
    method: "GET"
  });
}
