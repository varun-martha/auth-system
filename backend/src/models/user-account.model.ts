import { Schema, Types, model, type InferSchemaType } from "mongoose";

const userAccountSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 32
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: false
    },
    avatarUrl: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "disabled"],
      default: "active"
    },
    lastAuthenticatedAt: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true,
    collection: "user_accounts"
  }
);

export type UserAccountDocument = InferSchemaType<typeof userAccountSchema> & {
  _id: Types.ObjectId;
};
export const UserAccountModel = model("UserAccount", userAccountSchema);
