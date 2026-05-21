import { UserSessionModel, type UserSessionDocument } from "@/models/user-session.model.js";

export async function createUserSession(input: {
  userId: string;
  sessionTokenHash: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}): Promise<UserSessionDocument> {
  const createdSession = await UserSessionModel.create({
    userId: input.userId,
    sessionTokenHash: input.sessionTokenHash,
    expiresAt: input.expiresAt,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent
  });

  return createdSession.toObject() as UserSessionDocument;
}

export async function findActiveSessionByTokenHash(sessionTokenHash: string): Promise<UserSessionDocument | null> {
  return UserSessionModel.findOne({
    sessionTokenHash,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() }
  })
    .lean<UserSessionDocument>()
    .exec();
}

export async function revokeSessionById(sessionId: string): Promise<void> {
  await UserSessionModel.findByIdAndUpdate(sessionId, {
    revokedAt: new Date()
  }).exec();
}
