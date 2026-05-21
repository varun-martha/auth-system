import type { Router } from "express";

import { registerRegisterRoute } from "@/routes/auth/register.route.js";
import { registerLoginRoute } from "@/routes/auth/login.route.js";
import { registerGoogleRoute } from "@/routes/auth/google.route.js";
import { registerCurrentUserRoute } from "@/routes/auth/current-user.route.js";
import { registerLogoutRoute } from "@/routes/auth/logout.route.js";

export function registerAuthRoutes(router: Router): void {
  registerRegisterRoute(router);
  registerLoginRoute(router);
  registerGoogleRoute(router);
  registerCurrentUserRoute(router);
  registerLogoutRoute(router);
}
