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
    findOne: vi.fn().mockImplementation((query) => {
      if (query.$or) {
        const q1 = query.$or[0];
        if (q1.requesterId === "user123" && q1.recipientId === "existing_friend") {
          return { lean: vi.fn().mockResolvedValue({ _id: "f1", status: "pending" }) };
        }
        return { lean: vi.fn().mockResolvedValue(null) };
      }
      if (query._id === "valid_request") {
        return { 
          recipientId: { toString: () => "user123" },
          status: "pending",
          save: vi.fn().mockResolvedValue(true)
        };
      }
      return null;
    }),
    create: vi.fn().mockResolvedValue({ _id: "new_friendship", status: "pending" })
  }
}));

const app = express();
app.use(express.json());
registerFriendRoutes(app);

describe("Friend Requests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /friends/request", () => {
    it("should successfully send a friend request", async () => {
      const res = await request(app)
        .post("/friends/request")
        .send({ targetUserId: "new_friend" })
        .set("Authorization", "Bearer token");

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("should prevent duplicate requests", async () => {
      const res = await request(app)
        .post("/friends/request")
        .send({ targetUserId: "existing_friend" })
        .set("Authorization", "Bearer token");

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it("should prevent sending request to oneself", async () => {
      const res = await request(app)
        .post("/friends/request")
        .send({ targetUserId: "user123" })
        .set("Authorization", "Bearer token");

      expect(res.status).toBe(400);
    });
  });

  describe("POST /friends/accept", () => {
    it("should accept a valid friend request", async () => {
      const res = await request(app)
        .post("/friends/accept")
        .send({ friendshipId: "valid_request" })
        .set("Authorization", "Bearer token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for invalid request", async () => {
      const res = await request(app)
        .post("/friends/accept")
        .send({ friendshipId: "invalid_request" })
        .set("Authorization", "Bearer token");

      expect(res.status).toBe(404);
    });
  });
});
