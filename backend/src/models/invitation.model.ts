import { Schema, Types, model, type InferSchemaType } from "mongoose";

const invitationSchema = new Schema(
  {
    inviterId: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true
    },
    inviteeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Sent", "Joined"],
      default: "Sent"
    }
  },
  {
    timestamps: true,
    collection: "invitations"
  }
);

// Compound index to prevent sending multiple invites to the same email by the same user
invitationSchema.index({ inviterId: 1, inviteeEmail: 1 }, { unique: true });

export type InvitationDocument = InferSchemaType<typeof invitationSchema> & {
  _id: Types.ObjectId;
};
export const InvitationModel = model("Invitation", invitationSchema);
