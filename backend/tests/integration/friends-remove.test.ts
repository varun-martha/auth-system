import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { registerFriendRoutes } from "../../src/routes/friends/index.js";

vi.mock("../../src/middleware/session-auth.middleware.js", () => ({
  sessionAuthMiddleware: (req: any, res: any, next: any) => {
    req.authenticatedUser = { id: "user123", email: "test@example.com", username: "tester" };
    next();
  }
}));

vi.mock("../../src/models/friendship.model.js", () => ({
  FriendshipModel: {
    findOneAndDelete: vi.fn().mockImplementation((query) => {
      if (query._id === "valid_friendship") {
        return {
          lean: vi.fn().mockResolvedValue({ _id: "valid_friendship" })
        };
      }
      return {
        lean: vi.fn().mockResolvedValue(null)
      };
    })
  }
}));

const app = express();
app.use(express.json());
registerFriendRoutes(app);

describe("DELETE /friends/:friendshipId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully remove a friend or reject a request", async () => {
    const res = await request(app)
      .delete("/friends/valid_friendship")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/removed|rejected/i);
  });

  it("should return 404 if friendship not found or unauthorized", async () => {
    const res = await request(app)
      .delete("/friends/invalid_friendship")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
