import { createIdentityLink } from "@/repositories/identity-link.repository.js";
import {
  createUserAccount,
  findUserByEmail
} from "@/repositories/user-account.repository.js";
import { createSessionForUser } from "@/services/create-session.service.js";
import { buildUserSummary } from "@/services/get-user-summary.service.js";
import { hashPassword } from "@/utils/password.util.js";
import { InvitationModel } from "@/models/invitation.model.js";

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
  ipAddress: string;
  userAgent: string;
}): Promise<{
  redirectTo: string;
  sessionToken: string;
  user: ReturnType<typeof buildUserSummary>;
}> {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const user = await createUserAccount({
    username: input.username,
    email: input.email,
    passwordHash: await hashPassword(input.password)
  });

  await createIdentityLink({
    userId: String(user._id),
    provider: "credentials",
    providerEmail: user.email,
    providerSubject: String(user._id)
  });

  const session = await createSessionForUser({
    userId: String(user._id),
    ipAddress: input.ipAddress,
    userAgent: input.userAgent
  });

  // Automatically mark any pending invitations for this email as Joined
  await InvitationModel.updateMany(
    { inviteeEmail: input.email.toLowerCase(), status: "Sent" },
    { $set: { status: "Joined" } }
  );

  return {
    redirectTo: "/dashboard",
    sessionToken: session.rawToken,
    user: buildUserSummary(user)
  };
}
