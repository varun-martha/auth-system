import { z } from "zod";

export const createGroupBody = z.object({
  name: z.string().min(1).max(50).trim(),
  description: z.string().max(200).optional(),
  memberIds: z.array(z.string()).optional().default([]),
});

export const addMembersBody = z.object({
  memberIds: z.array(z.string()).min(1),
});

export type CreateGroupBody = z.infer<typeof createGroupBody>;
export type AddMembersBody = z.infer<typeof addMembersBody>;
