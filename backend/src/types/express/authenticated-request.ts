import type { Request } from "express";

import type { UserSummaryDto } from "@/types/auth/register-request.js";

export interface AuthenticatedRequest extends Request {
  authenticatedUser?: UserSummaryDto;
  sessionId?: string;
}
