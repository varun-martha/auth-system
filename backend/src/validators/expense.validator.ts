import { z } from "zod";

const splitItemSchema = z.object({
  userId: z.string(),
  amount: z.number().int().min(0).optional(),
  percentage: z.number().min(0).max(100).optional(),
});

export const createExpenseBody = z.object({
  title: z.string().min(1).max(100).trim(),
  totalAmount: z.number().int().min(1),
  currency: z.string().default("INR"),
  paidById: z.string(),
  splitMethod: z.enum(["equal", "custom", "percentage", "settlement"]),
  date: z.string().refine((d) => !isNaN(Date.parse(d)) && new Date(d) <= new Date(), {
    message: "Date must be a valid date not in the future",
  }),
  splits: z.array(splitItemSchema).optional(),
});

export type CreateExpenseBody = z.infer<typeof createExpenseBody>;
