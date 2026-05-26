import { describe, it, expect, vi, beforeEach } from "vitest";
import { EmailService } from "../../src/services/email.service.js";

// Mock the Nodemailer library
vi.mock("nodemailer", () => {
  return {
    default: {
      createTransport: vi.fn().mockImplementation(() => ({
        sendMail: vi.fn().mockResolvedValue(true)
      }))
    }
  };
});

// Mock environment variables to force SMTP configuration active
vi.mock("../../src/config/env.js", () => {
  return {
    env: {
      SMTP_HOST: "smtp.gmail.com",
      SMTP_PORT: 465,
      SMTP_USER: "test@gmail.com",
      SMTP_PASS: "secret"
    }
  };
});

describe("EmailService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send an invite email successfully", async () => {
    // In our test, nodemailer is mocked to resolve successfully
    const result = await EmailService.sendInviteEmail(
      "friend@example.com",
      "Alice",
      "http://localhost:3000/register?token=123"
    );

    expect(result.success).toBe(true);
  });
});
