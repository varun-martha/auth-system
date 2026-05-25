import { Schema, Types, model, type InferSchemaType } from "mongoose";

const identityLinkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      required: true
    },
    providerSubject: {
      type: String,
      required: false
    },
    providerEmail: {
      type: String,
      required: false
    },
    linkedAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    lastUsedAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: false,
    collection: "identity_links"
  }
);

identityLinkSchema.index(
  { provider: 1, providerSubject: 1 },
  { unique: true, sparse: true }
);

export type IdentityLinkDocument = InferSchemaType<
  typeof identityLinkSchema
> & { _id: Types.ObjectId };
export const IdentityLinkModel = model("IdentityLink", identityLinkSchema);
