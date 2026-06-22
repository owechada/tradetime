import { Router } from "express";
import { 
  proChartUploadMiddleware, 
  analyzeProChartController, 
  getProChartHistoryController 
} from "../controllers/ProChartAnalysisController";

const router = Router();

// Endpoint for analyzing a chart image
router.post("/analyze", proChartUploadMiddleware.single("chart"), analyzeProChartController);

// Endpoint for getting analysis history for a user
router.get("/history/:userId", getProChartHistoryController);

export default router;
