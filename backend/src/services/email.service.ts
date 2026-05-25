import nodemailer from "nodemailer";
import { env } from "@/config/env.js";

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 465,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    })
  : null;

export class EmailService {
  static async sendInviteEmail(
    toEmail: string,
    inviterName: string,
    inviteLink: string
  ): Promise<{ success: boolean; message?: string }> {
    if (!transporter) {
      console.warn("SMTP configuration missing. Skipping email to " + toEmail);
      console.warn(`[LOCAL DEV] Invite Link for ${toEmail}: ${inviteLink}`);
      return { success: true }; // Pretend success in dev if no configuration
    }

    try {
      await transporter.sendMail({
        from: `"PaySplit" <${env.SMTP_USER || "noreply@paysplit.com"}>`,
        to: toEmail,
        subject: `${inviterName} invited you to join PaySplit`,
        html: `<p>Hi there,</p>
               <p><strong>${inviterName}</strong> has invited you to join PaySplit to easily split bills and expenses.</p>
               <p><a href="${inviteLink}">Click here to sign up!</a></p>`
      });

      return { success: true };
    } catch (error: any) {
      console.error("Failed to send invite email", error);
      return { success: false, message: error.message || "Unknown error" };
    }
  }
}
