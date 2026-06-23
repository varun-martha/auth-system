import type { Router } from "express";

import { registerProfileRoute } from "@/routes/users/profile.route.js";
import { registerSearchRoute } from "@/routes/users/search.route.js";
import { registerDashboardRoute } from "@/routes/users/dashboard.route.js";
import { registerActivityRoute } from "@/routes/users/activity.route.js";

export function registerUserRoutes(router: Router): void {
  registerProfileRoute(router);
  registerSearchRoute(router);
  registerDashboardRoute(router);
  registerActivityRoute(router);
}
