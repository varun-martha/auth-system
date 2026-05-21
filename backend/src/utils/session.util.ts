import crypto from "node:crypto";

export function generateSessionToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function buildSessionExpiryDate(ttlHours: number): Date {
  return new Date(Date.now() + ttlHours * 60 * 60 * 1000);
}
