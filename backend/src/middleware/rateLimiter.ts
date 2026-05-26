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

export const searchRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many search requests, please try again later"
  }
});

export const friendRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 friend requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many friend requests, please try again later"
  }
});
