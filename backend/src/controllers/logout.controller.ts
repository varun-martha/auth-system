import type { Response } from "express";

import { env } from "@/config/env.js";
import { auditSessionEvent } from "@/services/audit-session-event.service.js";
import { logoutUser } from "@/services/logout-user.service.js";
import type { AuthenticatedRequest } from "@/types/express/authenticated-request.js";
import { getRequestMetadata } from "@/utils/audit-log.util.js";

export async function logoutController(request: AuthenticatedRequest, response: Response): Promise<void> {
  if (request.sessionId) {
    await logoutUser(request.sessionId);
  }

  await auditSessionEvent({
    userId: request.authenticatedUser?.id,
    eventType: "session_revoked",
    ...getRequestMetadata(request)
  });

  response.clearCookie(env.SESSION_COOKIE_NAME);
  response.status(204).send();
}
