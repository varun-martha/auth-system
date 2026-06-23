import { Schema, Types, model, type InferSchemaType } from "mongoose";

const expenseSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 1, // stored in cents, must be at least 1 cent
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    paidById: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    splitMethod: {
      type: String,
      enum: ["equal", "custom", "percentage", "settlement"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "expenses",
  }
);

// Chronological expense list per group
expenseSchema.index({ groupId: 1, date: -1 });
// For user-level balance queries
expenseSchema.index({ paidById: 1 });

export type ExpenseDocument = InferSchemaType<typeof expenseSchema> & {
  _id: Types.ObjectId;
};

export const ExpenseModel = model("Expense", expenseSchema);
