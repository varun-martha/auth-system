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

export interface Invite {
  _id: string;
  inviteeEmail: string;
  status: "Sent" | "Joined";
  createdAt: string;
}

export async function getInvites(): Promise<{ invites: Invite[] }> {
  return fetchJson<{ invites: Invite[] }>(buildApiUrl("/invites"), {
    method: "GET"
  });
}
