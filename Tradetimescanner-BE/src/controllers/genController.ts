import { Request, Response } from "express";
import {
  GetCurrencypairs,
  GetTadeStrategy,
  GetIndicatorRecommendations,
  GetForexStrategy,
  GetCryptoStrategy,
  GetGoldStrategy,
  GetIndicesStrategy,
} from "../generations/currencypairs";
import { getStablePairs } from "../generations/getStablePairs";
import {
  getLongTradeSignal,
  getShortTradeSignal,
} from "../generations/getSignals";
import { generateChartImage, generateDualCharts } from "../services/chartImageGenerator";

const getCurrencypairs = async (req: Request, res: Response) => {
  try {
    var rex = await GetCurrencypairs(req.body.data);
    res.status(200).json(rex);
  } catch (e: any) {
    res.status(500).json({ message: "Internal server error", error: e });
  }
};
const getStablePairsController = async (req: Request, res: Response) => {
  try {
    var rex = await getStablePairs(req.body.data);
    res.status(200).json(rex);
  } catch (e: any) {
    res.status(500).json({ message: "Internal server error", error: e });
  }
};

const geTradeSignalController = async (req: Request, res: Response) => {
  console.log("Received data:", req.body);
  try {
    if (req.body.trade_type == "longtrade") {
      var rex = await getLongTradeSignal(req.body);
      res.status(200).json(rex);
    } else {
      var rex = await getShortTradeSignal(req.body);
      res.status(200).json(rex);
    }
  } catch (e: any) {
    res.status(500).json({ message: "Internal server error_", error: e });
  }
};

const getTradeStrategy = async (req: Request, res: Response) => {
  try {
    var rex = await GetTadeStrategy(req.body.data);
    res.status(200).json(rex);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: "Internal server error", error: e });
  }
};

const getIndicatorOptions = async (req: any, res: any) => {
  try {
    const { markettype, timming, indicators, timeframe, tradetime } =
      req.body.data;
    console.log(
      markettype,
      timming,
      indicators,
      timeframe,
      tradetime,
      req.body
    );
    if (!markettype) {
      return res.status(400).json({
        message: "Missing required field: markettype is required",
      });
    }

    // Extract indicator names from the array of objects
    const indicatorNames =
      indicators && indicators.length > 0
        ? indicators.map((ind: any) => ind.name)
        : [];

    var rex = await GetIndicatorRecommendations({
      markettype,
      timming,
      indicators: indicatorNames,
      timeframe,
      tradetime,
    });

    // Generate dual chart images (CALL and PUT)
   
   //Commented because it slows results
    // if (rex && (rex.strategyExplanation || rex.tradePlan?.entryConditions)) {
    //   try {
    //     const dualCharts = await generateDualCharts({
    //       marketType: markettype,
    //       indicators: indicatorNames,
    //       strategyExplanation: rex.strategyExplanation || "",
    //       entryConditions: rex.tradePlan?.entryConditions || "",
    //       timeframe: timeframe || "1H",
    //       recommendedPairs: rex.recommendedPairs?.map((p: any) => p.pair) || [],
    //     });
    //     rex.signal_annotation = [dualCharts.bullishChart, dualCharts.bearishChart];
    //   } catch (imageError) {
    //     console.error("Failed to generate dual chart images:", imageError);
    //     rex.signal_annotation = [];
    //   }
    // }

    res.status(200).json(rex);
  } catch (e: any) {
    console.log("Error in getIndicatorOptions:", e);

    // Handle specific OpenAI API errors
    if (e.code === "ECONNRESET" || e.status === undefined) {
      return res.status(503).json({
        message: "Service temporarily unavailable. Please try again.",
        error: "Connection to AI service failed",
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: e.message || "An unexpected error occurred",
    });
  }
};

const getForexStrategy = async (req: any, res: any) => {
  try {
    const { indicators, timeframe } = req.body.data;
    console.log("Forex strategy request:", indicators, timeframe);

    // Extract indicator names from the array of objects
    const indicatorNames =
      indicators && indicators.length > 0
        ? indicators.map((ind: any) => ind.name)
        : [];

    var rex = await GetForexStrategy({
      indicators: indicatorNames,
      timeframe,
    });

    // Generate dual chart images
    if (rex) {
      try {
        const dualCharts = await generateDualCharts({
          marketType: "Forex",
          indicators: indicatorNames,
          strategyExplanation: rex.strategyExplanation || "",
          entryConditions: rex.tradePlan?.entryConditions || "",
          timeframe: timeframe || "1H",
          recommendedPairs: rex.recommendedPairs?.map((p: any) => p.pair) || [],
        });
        rex.signal_annotation = [dualCharts.bullishChart, dualCharts.bearishChart];
      } catch (imageError) {
        console.error("Failed to generate dual chart images:", imageError);
        rex.signal_annotation = [];
      }
    }

    res.status(200).json(rex);
  } catch (e: any) {
    console.log("Error in getForexStrategy:", e);

    // Handle specific OpenAI API errors
    if (e.code === "ECONNRESET" || e.status === undefined) {
      return res.status(503).json({
        message: "Service temporarily unavailable. Please try again.",
        error: "Connection to AI service failed",
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: e.message || "An unexpected error occurred",
    });
  }
};

const getCryptoStrategy = async (req: any, res: any) => {
  try {
    const { indicators, timeframe } = req.body.data;
    console.log("Crypto strategy request:", indicators, timeframe);

    // Extract indicator names from the array of objects
    const indicatorNames =
      indicators && indicators.length > 0
        ? indicators.map((ind: any) => ind.name)
        : [];

    var rex = await GetCryptoStrategy({
      indicators: indicatorNames,
      timeframe,
    });

    // Generate dual chart images
    if (rex) {
      try {
        const dualCharts = await generateDualCharts({
          marketType: "Crypto",
          indicators: indicatorNames,
          strategyExplanation: rex.strategyExplanation || "",
          entryConditions: rex.tradePlan?.entryConditions || "",
          timeframe: timeframe || "1H",
          recommendedCoins: rex.recommendedCoins?.map((c: any) => c.coin) || [],
        });
        rex.signal_annotation = [dualCharts.bullishChart, dualCharts.bearishChart];
      } catch (imageError) {
        console.error("Failed to generate dual chart images:", imageError);
        rex.signal_annotation = [];
      }
    }

    res.status(200).json(rex);
  } catch (e: any) {
    console.log("Error in getCryptoStrategy:", e);

    // Handle specific OpenAI API errors
    if (e.code === "ECONNRESET" || e.status === undefined) {
      return res.status(503).json({
        message: "Service temporarily unavailable. Please try again.",
        error: "Connection to AI service failed",
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: e.message || "An unexpected error occurred",
    });
  }
};

const getGoldStrategy = async (req: any, res: any) => {
  try {
    const { indicators, timeframe } = req.body.data;
    console.log("Gold strategy request:", indicators, timeframe);

    // Extract indicator names from the array of objects
    const indicatorNames =
      indicators && indicators.length > 0
        ? indicators.map((ind: any) => ind.name)
        : [];

    var rex = await GetGoldStrategy({
      indicators: indicatorNames,
      timeframe,
    });

    // Generate dual chart images
    if (rex) {
      try {
        const dualCharts = await generateDualCharts({
          marketType: "Gold",
          indicators: indicatorNames,
          strategyExplanation: rex.strategyExplanation || "",
          entryConditions: rex.tradePlan?.entryConditions || "",
          timeframe: timeframe || "1H",
        });
        rex.signal_annotation = [dualCharts.bullishChart, dualCharts.bearishChart];
      } catch (imageError) {
        console.error("Failed to generate dual chart images:", imageError);
        rex.signal_annotation = [];
      }
    }

    res.status(200).json(rex);
  } catch (e: any) {
    console.log("Error in getGoldStrategy:", e);
    res.status(500).json({ message: "Internal server error", error: e });
  }
};

const getIndicesStrategy = async (req: any, res: any) => {
  try {
    const { indicators, timeframe } = req.body.data;
    console.log("Indices strategy request:", indicators, timeframe);

    // Extract indicator names from the array of objects
    const indicatorNames =
      indicators && indicators.length > 0
        ? indicators.map((ind: any) => ind.name)
        : [];

    var rex = await GetIndicesStrategy({
      indicators: indicatorNames,
      timeframe,
    });

    // Generate dual chart images
    if (rex) {
      try {
        const dualCharts = await generateDualCharts({
          marketType: "Indices",
          indicators: indicatorNames,
          strategyExplanation: rex.strategyExplanation || "",
          entryConditions: rex.tradePlan?.entryConditions || "",
          timeframe: timeframe || "1H",
          recommendedIndices: rex.recommendedIndices?.map((i: any) => i.index) || [],
        });
        rex.signal_annotation = [dualCharts.bullishChart, dualCharts.bearishChart];
      } catch (imageError) {
        console.error("Failed to generate dual chart images:", imageError);
        rex.signal_annotation = [];
      }
    }

    res.status(200).json(rex);
  } catch (e: any) {
    console.log("Error in getIndicesStrategy:", e);
    res.status(500).json({ message: "Internal server error", error: e });
  }
};

export {
  getCurrencypairs,
  geTradeSignalController,
  getStablePairsController,
  getTradeStrategy,
  getIndicatorOptions,
  getForexStrategy,
  getCryptoStrategy,
  getGoldStrategy,
  getIndicesStrategy,
};
