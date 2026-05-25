import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../services/jwtService.js";
import { User } from "../models/user.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = verifyToken(token) as TokenPayload;

    // Check if user exists and hasn't logged out since token creation
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Not checking lastLogoutAt yet for simplicity, but could be added here
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
