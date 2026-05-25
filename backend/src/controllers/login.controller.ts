import type { Request, Response } from "express";

import { env } from "@/config/env.js";
import { auditLoginEvent } from "@/services/audit-login-event.service.js";
import { loginUser } from "@/services/login-user.service.js";
import { loginValidator } from "@/validators/login.validator.js";
import { getRequestMetadata } from "@/utils/audit-log.util.js";

export async function loginController(
  request: Request,
  response: Response
): Promise<void> {
  const parsedBody = loginValidator.safeParse(request.body);

  if (!parsedBody.success) {
    response.status(400).json({
      code: "INVALID_LOGIN_PAYLOAD",
      message: "Please provide a valid email and password."
    });
    return;
  }

  const metadata = getRequestMetadata(request);

  try {
    const result = await loginUser({
      ...parsedBody.data,
      ...metadata
    });

    await auditLoginEvent({
      userId: result.user.id,
      provider: "credentials",
      success: true,
      ...metadata
    });

    response.cookie(env.SESSION_COOKIE_NAME, result.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: env.SESSION_TTL_HOURS * 60 * 60 * 1000
    });

    response.status(200).json({
      user: result.user,
      redirectTo: result.redirectTo
    });
  } catch (error) {
    await auditLoginEvent({
      provider: "credentials",
      success: false,
      failureReason: error instanceof Error ? error.message : "unknown_error",
      ...metadata
    });

    response.status(401).json({
      code: "LOGIN_FAILED",
      message: error instanceof Error ? error.message : "Unable to sign in."
    });
  }
}
