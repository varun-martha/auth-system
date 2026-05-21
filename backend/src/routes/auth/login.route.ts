import type { Router } from "express";

import { loginController } from "@/controllers/login.controller.js";

export function registerLoginRoute(router: Router): void {
  router.post("/auth/login", loginController);
}
