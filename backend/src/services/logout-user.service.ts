import { revokeSessionById } from "@/repositories/user-session.repository.js";

export async function logoutUser(sessionId: string): Promise<void> {
  await revokeSessionById(sessionId);
}
