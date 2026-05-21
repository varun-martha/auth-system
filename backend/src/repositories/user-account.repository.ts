import { UserAccountModel, type UserAccountDocument } from "@/models/user-account.model.js";

export async function findUserByEmail(email: string): Promise<UserAccountDocument | null> {
  return UserAccountModel.findOne({ email: email.toLowerCase() }).lean<UserAccountDocument>().exec();
}

export async function findUserById(id: string): Promise<UserAccountDocument | null> {
  return UserAccountModel.findById(id).lean<UserAccountDocument>().exec();
}

export async function createUserAccount(input: {
  username: string;
  email: string;
  passwordHash?: string;
}): Promise<UserAccountDocument> {
  const createdUser = await UserAccountModel.create({
    username: input.username,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash
  });

  return createdUser.toObject() as UserAccountDocument;
}

export async function updateLastAuthenticatedAt(userId: string): Promise<void> {
  await UserAccountModel.findByIdAndUpdate(userId, {
    lastAuthenticatedAt: new Date()
  }).exec();
}
