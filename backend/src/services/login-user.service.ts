import { findUserByEmail, updateLastAuthenticatedAt } from "@/repositories/user-account.repository.js";
import { createSessionForUser } from "@/services/create-session.service.js";
import { buildUserSummary } from "@/services/get-user-summary.service.js";
import { verifyPassword } from "@/services/verify-password.service.js";

export async function loginUser(input: {
  email: string;
  password: string;
  ipAddress: string;
  userAgent: string;
}): Promise<{ redirectTo: string; sessionToken: string; user: ReturnType<typeof buildUserSummary> }> {
  const user = await findUserByEmail(input.email);

  if (!user?.passwordHash) {
    throw new Error("Invalid email or password.");
  }

  const passwordIsValid = await verifyPassword(input.password, user.passwordHash);

  if (!passwordIsValid) {
    throw new Error("Invalid email or password.");
  }

  await updateLastAuthenticatedAt(String(user._id));

  const session = await createSessionForUser({
    userId: String(user._id),
    ipAddress: input.ipAddress,
    userAgent: input.userAgent
  });

  return {
    redirectTo: "/dashboard",
    sessionToken: session.rawToken,
    user: buildUserSummary(user)
  };
}
