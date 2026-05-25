import {
  UserAccountModel,
  type UserAccountDocument
} from "@/models/user-account.model.js";

export async function findUserByEmail(
  email: string
): Promise<UserAccountDocument | null> {
  return UserAccountModel.findOne({ email: email.toLowerCase() })
    .lean<UserAccountDocument>()
    .exec();
}

export async function findUserById(
  id: string
): Promise<UserAccountDocument | null> {
  return UserAccountModel.findById(id).lean<UserAccountDocument>().exec();
}

export async function createUserAccount(input: {
  username: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
}): Promise<UserAccountDocument> {
  const randomSeed = Math.random().toString(36).substring(2, 10);
  const avatarUrl =
    input.avatarUrl ||
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}`;

  const createdUser = await UserAccountModel.create({
    username: input.username,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    avatarUrl
  });

  return createdUser.toObject() as UserAccountDocument;
}

export async function updateLastAuthenticatedAt(userId: string): Promise<void> {
  await UserAccountModel.findByIdAndUpdate(userId, {
    lastAuthenticatedAt: new Date()
  }).exec();
}

export async function updateUserAvatarUrl(
  userId: string,
  avatarUrl: string
): Promise<void> {
  await UserAccountModel.findByIdAndUpdate(userId, {
    avatarUrl
  }).exec();
}
