import { Schema, Types, model, type InferSchemaType } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    memberIds: {
      type: [Schema.Types.ObjectId],
      ref: "UserAccount",
      required: true,
      default: [],
    },
    isDirect: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "groups",
  }
);

// Fast lookup of all groups a user belongs to
groupSchema.index({ memberIds: 1 });
// Fast lookup of groups created by a user
groupSchema.index({ creatorId: 1 });
// For finding an existing direct split pair
groupSchema.index({ isDirect: 1, memberIds: 1 });

export type GroupDocument = InferSchemaType<typeof groupSchema> & {
  _id: Types.ObjectId;
};

export const GroupModel = model("Group", groupSchema);
