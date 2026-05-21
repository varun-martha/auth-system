import type { Express } from "express";
import express from "express";

import { registerAuthRoutes } from "@/routes/auth/index.js";
import { registerUserRoutes } from "@/routes/users/index.js";

export function registerRoutes(app: Express): void {
  const router = express.Router();

  router.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  registerAuthRoutes(router);
  registerUserRoutes(router);

  app.use("/api/v1", router);
}
