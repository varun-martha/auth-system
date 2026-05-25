import type { Router } from "express";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";
import { inviteRateLimiter } from "@/middleware/rateLimiter.js";
import { EmailService } from "@/services/email.service.js";
import { InvitationModel } from "@/models/invitation.model.js";
import { findUserByEmail } from "@/repositories/user-account.repository.js";
import { env } from "@/config/env.js";

export function registerInviteRoutes(router: Router): void {
  router.post(
    "/invites",
    inviteRateLimiter,
    sessionAuthMiddleware,
    async (request, response) => {
      try {
        const user = request.authenticatedUser;
        if (!user) {
          response.status(401).json({ message: "Unauthorized" });
          return;
        }

        const { email } = request.body;
        if (!email) {
          response.status(400).json({ message: "Email is required" });
          return;
        }

        if (email.toLowerCase() === user.email.toLowerCase()) {
          response.status(400).json({ message: "You cannot invite yourself." });
          return;
        }

        const existingUser = await findUserByEmail(email.toLowerCase());
        if (existingUser) {
          response
            .status(400)
            .json({ message: "This email is already registered on PaySplit." });
          return;
        }

        const existingInvite = await InvitationModel.findOne({
          inviterId: user.id,
          inviteeEmail: email.toLowerCase()
        });
        if (existingInvite) {
          response
            .status(400)
            .json({ message: "You have already invited this email." });
          return;
        }

        const inviteLink = `${env.APP_ORIGIN}/register`;
        const emailResult = await EmailService.sendInviteEmail(
          email,
          user.username,
          inviteLink
        );

        if (!emailResult.success) {
          response.status(500).json({
            message: emailResult.message
              ? `Failed to send email: ${emailResult.message}`
              : "Failed to send email."
          });
          return;
        }

        await InvitationModel.create({
          inviterId: user.id,
          inviteeEmail: email.toLowerCase(),
          status: "Sent"
        });

        response
          .status(201)
          .json({ success: true, message: "Invitation sent successfully." });
      } catch (err: any) {
        response
          .status(500)
          .json({ message: err.message || "Internal server error" });
      }
    }
  );

  router.get("/invites", sessionAuthMiddleware, async (request, response) => {
    try {
      const user = request.authenticatedUser;
      if (!user) {
        response.status(401).json({ message: "Unauthorized" });
        return;
      }

      const invites = await InvitationModel.find({ inviterId: user.id }).sort({
        createdAt: -1
      });
      response.status(200).json({ invites });
    } catch (err: any) {
      response
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  });
}
