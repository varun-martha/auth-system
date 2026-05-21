import { z } from "zod";

export const registerValidator = z.object({
  username: z.string().trim().min(3).max(32),
  email: z.string().trim().email(),
  password: z.string().min(8)
});
