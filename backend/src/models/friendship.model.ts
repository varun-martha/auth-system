import { Schema, Types, model, type InferSchemaType } from "mongoose";

const friendshipSchema = new Schema(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending"
    }
  },
  {
    timestamps: true,
    collection: "friendships"
  }
);

// Prevent duplicate friendship requests between the same users
friendshipSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });
// Optimize lookups for a user's friends
friendshipSchema.index({ requesterId: 1 });
friendshipSchema.index({ recipientId: 1 });

export type FriendshipDocument = InferSchemaType<typeof friendshipSchema> & {
  _id: Types.ObjectId;
};

export const FriendshipModel = model("Friendship", friendshipSchema);
