import { findUserById } from "@/repositories/user-account.repository.js";
import { buildUserSummary } from "@/services/get-user-summary.service.js";

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("Authenticated user could not be found.");
  }

  return buildUserSummary(user);
}
