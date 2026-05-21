import type { Request } from "express";

export function getRequestMetadata(request: Request): { ipAddress: string; userAgent: string } {
  return {
    ipAddress: request.ip || request.socket.remoteAddress || "unknown",
    userAgent: request.get("user-agent") || "unknown"
  };
}
