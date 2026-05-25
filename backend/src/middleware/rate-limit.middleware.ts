import type { NextFunction, Request, Response } from "express";

const attemptStore = new Map<string, { count: number; expiresAt: number }>();
const MAX_ATTEMPTS = 1000;
const WINDOW_MS = 15 * 60 * 1000;

export function authRateLimitMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const key = request.ip || "unknown";
  const currentTime = Date.now();
  const currentEntry = attemptStore.get(key);

  if (!currentEntry || currentEntry.expiresAt < currentTime) {
    attemptStore.set(key, { count: 1, expiresAt: currentTime + WINDOW_MS });
    next();
    return;
  }

  if (currentEntry.count >= MAX_ATTEMPTS) {
    response.status(429).json({
      code: "TOO_MANY_ATTEMPTS",
      message: "Too many authentication attempts. Please try again later."
    });
    return;
  }

  currentEntry.count += 1;
  attemptStore.set(key, currentEntry);
  next();
}
