import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { env } from "@/config/env.js";
import { authRateLimitMiddleware } from "@/middleware/rate-limit.middleware.js";
import { errorHandlerMiddleware } from "@/middleware/error-handler.middleware.js";
import { registerRoutes } from "@/routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.APP_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1/auth", authRateLimitMiddleware);

  registerRoutes(app);

  app.use(errorHandlerMiddleware);

  return app;
}
