import { env } from "@/config/env.js";
import { createUserSession } from "@/repositories/user-session.repository.js";
import { buildSessionExpiryDate, generateSessionToken, hashSessionToken } from "@/utils/session.util.js";

export async function createSessionForUser(input: {
  userId: string;
  ipAddress: string;
  userAgent: string;
}): Promise<{ sessionId: string; rawToken: string }> {
  const rawToken = generateSessionToken();
  const hashedToken = hashSessionToken(rawToken);
  const session = await createUserSession({
    userId: input.userId,
    sessionTokenHash: hashedToken,
    expiresAt: buildSessionExpiryDate(env.SESSION_TTL_HOURS),
    ipAddress: input.ipAddress,
    userAgent: input.userAgent
  });

  return {
    sessionId: String(session._id),
    rawToken
  };
}
