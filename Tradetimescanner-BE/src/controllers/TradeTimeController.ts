import { Request, Response } from "express";
import { getMarketStatus, getRecommendedPairs } from "../services/marketSessionService";

/**
 * Get current market status (active sessions, liquidity, explanation)
 * @route POST /api/tradetime/status
 */
export const getTradeTimeStatus = (req: Request, res: Response) => {
  try {
    // We accept timezone in body but currently calculate based on server UTC time
    // In a more advanced version, we could adjust "local time" display for the user
    // const { timezone } = req.body; 
    const status = getMarketStatus();
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error("Error getting trade time status:", error);
    res.status(500).json({
      success: false,
      message: "Error getting trade time status",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * Get recommended currency pairs based on current session
 * @route POST /api/tradetime/recommendations
 */
export const getTradeTimeRecommendations = (req: Request, res: Response) => {
  try {
    const recommendations = getRecommendedPairs();
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error("Error getting trade time recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Error getting trade time recommendations",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
