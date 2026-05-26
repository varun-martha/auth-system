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
    find: vi.fn().mockImplementation(() => {
      return {
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([
              {
                _id: "friendship1",
                requesterId: { _id: "user456", username: "friend1", email: "f1@example.com" },
                recipientId: { _id: "user123" },
                status: "accepted"
              },
              {
                _id: "friendship2",
                requesterId: { _id: "user123" },
                recipientId: { _id: "user789", username: "pendingFriend", email: "f2@example.com" },
                status: "pending"
              }
            ])
          })
        })
      };
    })
  }
}));

const app = express();
app.use(express.json());
registerFriendRoutes(app);

describe("GET /friends", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return list of friends and pending requests", async () => {
    const res = await request(app)
      .get("/friends")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(200);
    expect(res.body.friends).toBeDefined();
    expect(res.body.pendingRequests).toBeDefined();
    
    expect(res.body.friends).toHaveLength(1);
    expect(res.body.friends[0].username).toBe("friend1");
    expect(res.body.friends[0].friendshipId).toBe("friendship1");

    expect(res.body.pendingRequests).toHaveLength(1);
    expect(res.body.pendingRequests[0].username).toBe("pendingFriend");
    expect(res.body.pendingRequests[0].direction).toBe("outgoing");
  });
});
