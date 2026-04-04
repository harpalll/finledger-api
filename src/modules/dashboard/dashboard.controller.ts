import type { Request, Response } from "express";
import {
  getSummaryService,
  getCategoryBreakdownService,
  getRecentActivityService,
  getTrendsService,
} from "./dashboard.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const getSummary = async (_req: Request, res: Response) => {
  try {
    const data = await getSummaryService();

    return res.status(200).json(new ApiResponse(true, data, null));
  } catch (error: any) {
    return res.status(500).json(
      new ApiResponse(false, null, {
        message: "Failed to fetch summary",
      }),
    );
  }
};

export const getCategoryBreakdown = async (_req: Request, res: Response) => {
  try {
    const data = await getCategoryBreakdownService();

    return res.status(200).json(new ApiResponse(true, data, null));
  } catch {
    return res.status(500).json(
      new ApiResponse(false, null, {
        message: "Failed to fetch category breakdown",
      }),
    );
  }
};

export const getRecentActivity = async (_req: Request, res: Response) => {
  try {
    const data = await getRecentActivityService();

    return res.status(200).json(new ApiResponse(true, data, null));
  } catch {
    return res.status(500).json(
      new ApiResponse(false, null, {
        message: "Failed to fetch recent activity",
      }),
    );
  }
};

export const getTrends = async (_req: Request, res: Response) => {
  try {
    const data = await getTrendsService();

    return res.status(200).json(new ApiResponse(true, data, null));
  } catch {
    return res.status(500).json(
      new ApiResponse(false, null, {
        message: "Failed to fetch trends",
      }),
    );
  }
};
