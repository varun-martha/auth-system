import { UserAccountModel } from "@/models/user-account.model.js";

export class UserService {
  /**
   * Generates a deterministic avatar URL using DiceBear based on the user's email.
   * Updates the user document if it doesn't already have an avatarUrl.
   */
  static async ensureAvatar(userId: string, email: string): Promise<string> {
    const defaultAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    await UserAccountModel.updateOne(
      { _id: userId, avatarUrl: { $exists: false } },
      { $set: { avatarUrl: defaultAvatarUrl } }
    );

    return defaultAvatarUrl;
  }
}
