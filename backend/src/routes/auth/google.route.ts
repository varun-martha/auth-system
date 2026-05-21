import type { Router } from "express";

import { googleAuthController } from "@/controllers/google-auth.controller.js";

export function registerGoogleRoute(router: Router): void {
  router.post("/auth/google", googleAuthController);
}
