import { createAuthAuditEvent } from "@/repositories/auth-audit-event.repository.js";

export async function auditLoginEvent(input: {
  userId?: string;
  provider: "credentials" | "google";
  success: boolean;
  ipAddress: string;
  userAgent: string;
  failureReason?: string;
}): Promise<void> {
  await createAuthAuditEvent({
    userId: input.userId,
    eventType: input.provider === "google"
      ? input.success
        ? "google_sign_in_success"
        : "google_sign_in_failure"
      : input.success
        ? "sign_in_success"
        : "sign_in_failure",
    provider: input.provider,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    metadata: input.failureReason ? { failureReason: input.failureReason } : undefined
  });
}
