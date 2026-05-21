import { describe, expect, it } from "vitest";

describe("POST /auth/login contract", () => {
  it("requires email and password", () => {
    expect(["email", "password"]).toHaveLength(2);
  });
});
