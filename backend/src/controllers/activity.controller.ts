import type { Request, Response } from "express";
import { getUserActivityHistory } from "@/services/activity.service.js";

export async function getGlobalActivityController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const before = req.query.before as string | undefined;
    const limit = parseInt(req.query.limit as string) || 50;

    const activity = await getUserActivityHistory(userId, limit, before);
    res.status(200).json({ success: true, activity });
  } catch (error: any) {
    console.error("getGlobalActivityController error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error." });
  }
}
