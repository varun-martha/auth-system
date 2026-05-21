import type { AuthenticatedUser } from "@/types/auth/register";

let cachedUser: AuthenticatedUser | null = null;

export function setCachedUser(user: AuthenticatedUser | null): void {
  cachedUser = user;
}

export function getCachedUser(): AuthenticatedUser | null {
  return cachedUser;
}
