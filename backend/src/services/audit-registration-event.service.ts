import { createAuthAuditEvent } from "@/repositories/auth-audit-event.repository.js";

export async function auditRegistrationEvent(input: {
  userId?: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
}): Promise<void> {
  await createAuthAuditEvent({
    userId: input.userId,
    eventType: input.success ? "sign_up_success" : "sign_in_failure",
    provider: "credentials",
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    metadata: input.failureReason
      ? { failureReason: input.failureReason }
      : undefined
  });
}
