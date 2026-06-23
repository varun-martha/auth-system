import { Schema, Types, model, type InferSchemaType } from "mongoose";

const expenseSplitSchema = new Schema(
  {
    expenseId: {
      type: Schema.Types.ObjectId,
      ref: "Expense",
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true, // denormalised for fast group-level balance queries
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // stored in cents
    },
    percentage: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "expense_splits",
  }
);

// Get all splits for an expense
expenseSplitSchema.index({ expenseId: 1 });
// Get all splits for a user in a group (balance aggregation)
expenseSplitSchema.index({ groupId: 1, userId: 1 });
// Cross-group balance lookups
expenseSplitSchema.index({ userId: 1 });

export type ExpenseSplitDocument = InferSchemaType<typeof expenseSplitSchema> & {
  _id: Types.ObjectId;
};

export const ExpenseSplitModel = model("ExpenseSplit", expenseSplitSchema);
