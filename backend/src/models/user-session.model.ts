import { Schema, Types, model, type InferSchemaType } from "mongoose";

const userSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true
    },
    sessionTokenHash: {
      type: String,
      required: true,
      unique: true
    },
    issuedAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    },
    revokedAt: {
      type: Date,
      required: false
    },
    ipAddress: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    }
  },
  {
    timestamps: false,
    collection: "user_sessions"
  }
);

export type UserSessionDocument = InferSchemaType<typeof userSessionSchema> & {
  _id: Types.ObjectId;
};
export const UserSessionModel = model("UserSession", userSessionSchema);
