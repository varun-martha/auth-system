import rateLimit from "express-rate-limit";

export const inviteRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 invites per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many invites sent from this IP, please try again after 15 minutes"
  }
});
