import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { registerUserRoutes } from "../../src/routes/users/index.js";

vi.mock("../../src/middleware/session-auth.middleware.js", () => ({
  sessionAuthMiddleware: (req: any, res: any, next: any) => {
    if (req.headers.authorization === "fail") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.authenticatedUser = { id: "user123", email: "searcher@example.com", username: "Searcher" };
    next();
  }
}));

vi.mock("../../src/models/user-account.model.js", () => ({
  UserAccountModel: {
    find: vi.fn().mockImplementation((query) => {
      let results: any[] = [];
      const $or = query.$or;
      if ($or) {
        const usernameRegex = $or[0].username;
        const emailRegex = $or[1].email;
        if (usernameRegex.test("john") || emailRegex.test("john")) {
          results.push({ _id: "u1", username: "johndoe", email: "john@example.com", avatarUrl: "http://av" });
        }
      }
      return {
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue(results)
          })
        })
      };
    })
  }
}));

const app = express();
app.use(express.json());
registerUserRoutes(app);

describe("GET /users/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return users matching the search query", async () => {
    const res = await request(app)
      .get("/users/search?q=john")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(200);
    expect(res.body.users).toBeDefined();
    expect(res.body.users).toHaveLength(1);
    expect(res.body.users[0].username).toBe("johndoe");
  });

  it("should require a minimum of 2 characters for the query", async () => {
    const res = await request(app)
      .get("/users/search?q=j")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least 2 characters/i);
  });

  it("should return empty array if no matches", async () => {
    const res = await request(app)
      .get("/users/search?q=unknown")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(0);
  });
});
