import { z } from "zod";

export const loginValidator = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});
