import { z } from "zod";

export const googleAuthValidator = z.object({
  idToken: z.string().min(1)
});
