import { OAuth2Client } from "google-auth-library";

import { env } from "@/config/env.js";

const oauthClient = new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);

export async function verifyGoogleToken(idToken: string): Promise<{
  email: string;
  subject: string;
  username: string;
}> {
  const ticket = await oauthClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email) {
    throw new Error("Google identity token is missing required claims.");
  }

  const username =
    payload.name?.trim().replace(/\s+/g, "-").toLowerCase() ||
    payload.email.split("@")[0].toLowerCase();

  return {
    email: payload.email.toLowerCase(),
    subject: payload.sub,
    username
  };
}
