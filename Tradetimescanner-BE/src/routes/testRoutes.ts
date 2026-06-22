import { Router, Request, Response } from "express";
import { generateChartImage } from "../services/chartImageGenerator";

const testRouter = Router();

// Health check endpoint for chart generation service
testRouter.post("/chart-generation-test", async (req: Request, res: Response) => {
    try {
        console.log("Testing chart generation service...");
        const testRequest = {
            marketType: "Forex",
            indicators: ["RSI", "MACD", "Bollinger Bands"],
            strategyExplanation: "Test strategy using RSI oversold conditions with MACD bullish crossover and price touching Bollinger Bands lower band",
            entryConditions: "Enter CALL when RSI < 30, MACD shows bullish crossover, and price touches lower Bollinger Band",
            timeframe: "1H",
            recommendedPairs: ["EUR/USD"]
        };

        const startTime = Date.now();
        const imageUrl = await generateChartImage(testRequest);
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        res.status(200).json({
            success: true,
            message: "Chart generation test completed",
            imageUrl: imageUrl,
            duration: `${duration.toFixed(2)}s`,
            testRequest: testRequest,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("Chart generation test failed:", error);
        res.status(500).json({
            success: false,
            message: "Chart generation test failed",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Simple ping endpoint
testRouter.get("/ping", (req: Request, res: Response) => {
    const apiKey = process.env.OPENAI_API_KEY;
    res.status(200).json({
        success: true,
        message: "Chart generation service is running",
        timestamp: new Date().toISOString(),
        openaiConfigured: !!apiKey,
        apiKeyPreview: apiKey ? `${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 4)}` : 'Not found',
        envCheck: {
            PORT: process.env.PORT,
            NODE_ENV: process.env.NODE_ENV
        }
    });
});

export default testRouter;
