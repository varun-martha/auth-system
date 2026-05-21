import type { UserSummaryDto } from "@/types/auth/register-request.js";

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: UserSummaryDto;
      sessionId?: string;
    }
  }
}

export {};
