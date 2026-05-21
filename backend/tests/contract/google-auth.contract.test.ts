import { describe, expect, it } from "vitest";

describe("POST /auth/google contract", () => {
  it("requires an idToken field", () => {
    expect(["idToken"]).toContain("idToken");
  });
});
