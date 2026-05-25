import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { registerInviteRoutes } from "../../src/routes/invites/index.js";

// Mock dependencies
vi.mock("../../src/middleware/session-auth.middleware.js", () => ({
  sessionAuthMiddleware: (req: any, res: any, next: any) => {
    // If testing unauthorized
    if (req.headers.authorization === "fail") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Simulate authenticated user
    req.authenticatedUser = { id: "user123", email: "inviter@example.com", username: "Inviter" };
    next();
  }
}));

vi.mock("../../src/repositories/user-account.repository.js", () => ({
  findUserByEmail: vi.fn().mockImplementation(async (email) => {
    if (email === "existing@example.com") return { _id: "existing123" };
    return null;
  })
}));

vi.mock("../../src/models/invitation.model.js", () => ({
  InvitationModel: {
    findOne: vi.fn().mockImplementation(async ({ inviteeEmail }) => {
      if (inviteeEmail === "alreadyinvited@example.com") return { _id: "invite123" };
      return null;
    }),
    create: vi.fn().mockResolvedValue({ _id: "newinvite123" }),
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockResolvedValue([
        { _id: "inv1", inviteeEmail: "friend@example.com", status: "Sent" }
      ])
    })
  }
}));

vi.mock("../../src/services/email.service.js", () => ({
  EmailService: {
    sendInviteEmail: vi.fn().mockResolvedValue({ success: true })
  }
}));

// Setup Express App
const app = express();
app.use(express.json());
registerInviteRoutes(app);

describe("POST /invites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully send an invite", async () => {
    const res = await request(app)
      .post("/invites")
      .send({ email: "newfriend@example.com" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Invitation sent successfully.");
  });

  it("should reject inviting an already registered user", async () => {
    const res = await request(app)
      .post("/invites")
      .send({ email: "existing@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already registered/i);
  });

  it("should fail on rate limiting after 10 requests", async () => {
    // Make 10 successful requests
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post("/invites")
        .send({ email: `friend${i}@example.com` });
    }
    
    // 11th request should hit rate limit
    const res = await request(app)
      .post("/invites")
      .send({ email: "ratelimit@example.com" });

    expect(res.status).toBe(429);
    expect(res.text).toMatch(/Too many invites sent/i);
  });
});

describe("GET /invites", () => {
  it("should return the list of invited people", async () => {
    const res = await request(app).get("/invites");
    
    expect(res.status).toBe(200);
    expect(res.body.invites).toBeDefined();
    expect(Array.isArray(res.body.invites)).toBe(true);
    expect(res.body.invites[0].inviteeEmail).toBe("friend@example.com");
  });
});
