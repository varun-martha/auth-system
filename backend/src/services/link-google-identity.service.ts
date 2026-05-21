import { createIdentityLink, findIdentityLinkByProviderSubject, touchIdentityLink } from "@/repositories/identity-link.repository.js";
import { createUserAccount, findUserByEmail, findUserById, updateLastAuthenticatedAt } from "@/repositories/user-account.repository.js";
import { createSessionForUser } from "@/services/create-session.service.js";
import { buildUserSummary } from "@/services/get-user-summary.service.js";

export async function loginWithGoogleIdentity(input: {
  email: string;
  subject: string;
  username: string;
  ipAddress: string;
  userAgent: string;
}): Promise<{ created: boolean; redirectTo: string; sessionToken: string; user: ReturnType<typeof buildUserSummary> }> {
  const existingLink = await findIdentityLinkByProviderSubject("google", input.subject);

  if (existingLink) {
    const linkedUser = await findUserById(String(existingLink.userId));

    if (!linkedUser) {
      throw new Error("Linked Google account no longer exists.");
    }

    await touchIdentityLink(String(existingLink._id));
    await updateLastAuthenticatedAt(String(linkedUser._id));

    const session = await createSessionForUser({
      userId: String(linkedUser._id),
      ipAddress: input.ipAddress,
      userAgent: input.userAgent
    });

    return {
      created: false,
      redirectTo: "/dashboard",
      sessionToken: session.rawToken,
      user: buildUserSummary(linkedUser)
    };
  }

  const existingUser = await findUserByEmail(input.email);
  const user =
    existingUser ||
    (await createUserAccount({
      username: input.username,
      email: input.email
    }));

  await createIdentityLink({
    userId: String(user._id),
    provider: "google",
    providerSubject: input.subject,
    providerEmail: input.email
  });
  await updateLastAuthenticatedAt(String(user._id));

  const session = await createSessionForUser({
    userId: String(user._id),
    ipAddress: input.ipAddress,
    userAgent: input.userAgent
  });

  return {
    created: !existingUser,
    redirectTo: "/dashboard",
    sessionToken: session.rawToken,
    user: buildUserSummary(user)
  };
}
