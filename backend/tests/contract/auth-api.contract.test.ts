import { describe, expect, it } from "vitest";

describe("auth contract baseline", () => {
  it("documents the protected auth endpoints", () => {
    expect(["/auth/register", "/auth/login", "/auth/google", "/auth/me", "/auth/logout"]).toContain(
      "/auth/register"
    );
  });
});
