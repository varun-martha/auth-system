import type { Router } from "express";

import { registerProfileRoute } from "@/routes/users/profile.route.js";

export function registerUserRoutes(router: Router): void {
  registerProfileRoute(router);
}
