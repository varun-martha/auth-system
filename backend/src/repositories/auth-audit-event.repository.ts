import { AuthAuditEventModel } from "@/models/auth-audit-event.model.js";

export async function createAuthAuditEvent(input: {
  userId?: string;
  eventType:
    | "sign_up_success"
    | "sign_in_success"
    | "sign_in_failure"
    | "google_sign_in_success"
    | "google_sign_in_failure"
    | "session_revoked"
    | "unauthorized_access_attempt";
  provider: "credentials" | "google" | "system";
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await AuthAuditEventModel.create({
    userId: input.userId,
    eventType: input.eventType,
    provider: input.provider,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    metadata: input.metadata
  });
}
