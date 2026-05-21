import type { UserAccountDocument } from "@/models/user-account.model.js";
import type { UserSummaryDto } from "@/types/auth/register-request.js";

export function buildUserSummary(user: UserAccountDocument): UserSummaryDto {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email
  };
}
