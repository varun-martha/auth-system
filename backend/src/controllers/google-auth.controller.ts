import type { Request, Response } from "express";

import { env } from "@/config/env.js";
import { auditLoginEvent } from "@/services/audit-login-event.service.js";
import { loginWithGoogleIdentity } from "@/services/link-google-identity.service.js";
import { verifyGoogleToken } from "@/services/verify-google-token.service.js";
import { googleAuthValidator } from "@/validators/google-auth.validator.js";
import { getRequestMetadata } from "@/utils/audit-log.util.js";

export async function googleAuthController(
  request: Request,
  response: Response
): Promise<void> {
  const parsedBody = googleAuthValidator.safeParse(request.body);

  if (!parsedBody.success) {
    response.status(400).json({
      code: "INVALID_GOOGLE_PAYLOAD",
      message: "A Google identity token is required."
    });
    return;
  }

  const metadata = getRequestMetadata(request);

  try {
    const googleIdentity = await verifyGoogleToken(parsedBody.data.idToken);
    const result = await loginWithGoogleIdentity({
      ...googleIdentity,
      ...metadata
    });

    await auditLoginEvent({
      userId: result.user.id,
      provider: "google",
      success: true,
      ...metadata
    });

    response.cookie(env.SESSION_COOKIE_NAME, result.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: env.SESSION_TTL_HOURS * 60 * 60 * 1000
    });

    response.status(result.created ? 201 : 200).json({
      user: result.user,
      redirectTo: result.redirectTo
    });
  } catch (error) {
    await auditLoginEvent({
      provider: "google",
      success: false,
      failureReason: error instanceof Error ? error.message : "unknown_error",
      ...metadata
    });
    console.error("Google authentication error:", error);

    response.status(401).json({
      code: "GOOGLE_AUTH_FAILED",
      message:
        error instanceof Error
          ? error.message
          : "Unable to complete Google sign-in."
    });
  }
}
