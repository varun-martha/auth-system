import type { NextFunction, Request, Response } from "express";

export function errorHandlerMiddleware(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
): void {
  response.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: error.message || "Unexpected server error."
  });
}
