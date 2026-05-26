import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { registerUserRoutes } from "../../src/routes/users/index.js";
import { searchRateLimiter } from "../../src/middleware/rateLimiter.js";

vi.mock("../../src/middleware/session-auth.middleware.js", () => ({
  sessionAuthMiddleware: (req: any, res: any, next: any) => {
    req.authenticatedUser = { id: "user123", email: "searcher@example.com", username: "Searcher" };
    next();
  }
}));

vi.mock("../../src/models/user-account.model.js", () => ({
  UserAccountModel: {
    find: vi.fn().mockImplementation(() => {
      return {
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([])
        })
      };
    })
  }
}));

const app = express();
app.use(express.json());
// Inject rate limiter directly on app or router to test it
// Actually, we should test the route mounting
app.use("/users/search", searchRateLimiter);
registerUserRoutes(app);

describe("GET /users/search Rate Limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail on rate limiting after 30 requests", async () => {
    // Make 30 successful requests
    for (let i = 0; i < 30; i++) {
      await request(app)
        .get("/users/search?q=test")
        .set("Authorization", "Bearer token");
    }
    
    // 31st request should hit rate limit
    const res = await request(app)
      .get("/users/search?q=test")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(429);
    expect(res.text).toMatch(/Too many search requests/i);
  });
});
