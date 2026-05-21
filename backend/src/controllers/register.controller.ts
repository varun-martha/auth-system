import type { Request, Response } from "express";

import { env } from "@/config/env.js";
import { auditRegistrationEvent } from "@/services/audit-registration-event.service.js";
import { registerUser } from "@/services/register-user.service.js";
import { registerValidator } from "@/validators/register.validator.js";
import { getRequestMetadata } from "@/utils/audit-log.util.js";

export async function registerController(request: Request, response: Response): Promise<void> {
  const parsedBody = registerValidator.safeParse(request.body);

  if (!parsedBody.success) {
    response.status(400).json({
      code: "INVALID_REGISTRATION_PAYLOAD",
      message: "Please provide a valid username, email, and password."
    });
    return;
  }

  const metadata = getRequestMetadata(request);

  try {
    const result = await registerUser({
      ...parsedBody.data,
      ...metadata
    });

    await auditRegistrationEvent({
      userId: result.user.id,
      success: true,
      ...metadata
    });

    response.cookie(env.SESSION_COOKIE_NAME, result.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: env.SESSION_TTL_HOURS * 60 * 60 * 1000
    });

    response.status(201).json({
      user: result.user,
      redirectTo: result.redirectTo
    });
  } catch (error) {
    await auditRegistrationEvent({
      success: false,
      failureReason: error instanceof Error ? error.message : "unknown_error",
      ...metadata
    });

    response.status(409).json({
      code: "REGISTRATION_FAILED",
      message: error instanceof Error ? error.message : "Registration failed."
    });
  }
}
