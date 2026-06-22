import { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import ProChartAnalysis from "../models/ProChartAnalysis";
import { analyzeProChart } from "../services/ProChartAnalysisService";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = "public/pro-charts";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (JPG, PNG) and PDFs are allowed!"));
    }
  },
});

export const proChartUploadMiddleware = upload;

export const analyzeProChartController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No chart file uploaded" });
      return;
    }

    const { market, marketType, timeframe, tradeMode, userId, tradeDuration } = req.body;

    if (!market || !marketType || !timeframe || !tradeMode || !userId) {
      // Cleanup uploaded file if missing parameters
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(400).json({ message: "market, marketType, timeframe, tradeMode, and userId are required" });
      return;
    }

    const analysisResult = await analyzeProChart({
      imagePath: req.file.path,
      market,
      marketType,
      timeframe,
      tradeMode,
      tradeDuration,
    });

    const analysis = await ProChartAnalysis.create({
      userId,
      imagePath: req.file.path,
      market,
      marketType,
      timeframe,
      tradeMode,
      tradeDuration,
      analysisResult,
    });

    res.status(200).json({
      message: "Analysis completed successfully",
      data: analysis,
    });
  } catch (error: any) {
    console.error("Error in analyzeProChartController:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getProChartHistoryController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const history = await ProChartAnalysis.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(history);
  } catch (error: any) {
    console.error("Error in getProChartHistoryController:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
