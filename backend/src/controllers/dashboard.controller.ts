import type { Request, Response } from "express";
import { getDashboardSummary } from "@/services/dashboard.service.js";

export async function getDashboardSummaryController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const summary = await getDashboardSummary(userId);
    res.status(200).json({ success: true, summary });
  } catch (error: any) {
    console.error("getDashboardSummaryController error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}
