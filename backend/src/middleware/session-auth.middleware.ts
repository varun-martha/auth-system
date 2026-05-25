import type { NextFunction, Request, Response } from "express";

import { env } from "@/config/env.js";
import { findActiveSessionByTokenHash } from "@/repositories/user-session.repository.js";
import { findUserById } from "@/repositories/user-account.repository.js";
import { buildUserSummary } from "@/services/get-user-summary.service.js";
import { createAuthAuditEvent } from "@/repositories/auth-audit-event.repository.js";
import { getRequestMetadata } from "@/utils/audit-log.util.js";
import { hashSessionToken } from "@/utils/session.util.js";

export async function sessionAuthMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const rawSessionToken = request.cookies?.[env.SESSION_COOKIE_NAME];

  if (!rawSessionToken) {
    response.status(401).json({
      code: "UNAUTHORIZED",
      message: "Authentication is required."
    });
    return;
  }

  const session = await findActiveSessionByTokenHash(
    hashSessionToken(rawSessionToken)
  );

  if (!session) {
    await createAuthAuditEvent({
      eventType: "unauthorized_access_attempt",
      provider: "system",
      ...getRequestMetadata(request)
    });
    response.status(401).json({
      code: "UNAUTHORIZED",
      message: "Session is invalid or expired."
    });
    return;
  }

  const user = await findUserById(String(session.userId));

  if (!user) {
    response.status(401).json({
      code: "UNAUTHORIZED",
      message: "Session is invalid or expired."
    });
    return;
  }

  request.authenticatedUser = buildUserSummary(user);
  request.sessionId = String(session._id);
  next();
}
