import express from "express";
import { 
  getTradeTimeStatus, 
  getTradeTimeRecommendations 
} from "../controllers/TradeTimeController";

const router = express.Router();

/**
 * @route POST /api/tradetime/status
 * @desc Get current market session status, liquidity, and explanation
 */
router.post("/status", getTradeTimeStatus);

/**
 * @route POST /api/tradetime/recommendations
 * @desc Get recommended currency pairs based on current session
 */
router.post("/recommendations", getTradeTimeRecommendations);

export default router;
