import { createAuthAuditEvent } from "@/repositories/auth-audit-event.repository.js";

export async function auditSessionEvent(input: {
  userId?: string;
  eventType: "session_revoked" | "unauthorized_access_attempt";
  ipAddress: string;
  userAgent: string;
}): Promise<void> {
  await createAuthAuditEvent({
    userId: input.userId,
    eventType: input.eventType,
    provider: "system",
    ipAddress: input.ipAddress,
    userAgent: input.userAgent
  });
}
