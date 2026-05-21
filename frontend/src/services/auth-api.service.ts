import { getFrontendEnv } from "@/lib/env";

export function buildApiUrl(pathname: string): string {
  return `${getFrontendEnv().apiBaseUrl}${pathname}`;
}
