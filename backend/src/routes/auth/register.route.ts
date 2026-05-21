import type { Router } from "express";

import { registerController } from "@/controllers/register.controller.js";

export function registerRegisterRoute(router: Router): void {
  router.post("/auth/register", registerController);
}
