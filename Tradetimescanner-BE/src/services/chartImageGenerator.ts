import OpenAI from "openai";
import fs from "fs";
import path from "path";
import axios from "axios";

export interface ChartGenerationRequest {
  marketType: string;
  indicators: string[];
  strategyExplanation: string;
  entryConditions: string;
  timeframe: string;
  recommendedPairs?: string[];
  recommendedCoins?: string[];
  recommendedIndices?: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 120000, // 2 minutes timeout
  maxRetries: 2, // Retry failed requests
});

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 2, // Reduced to 2 retries for faster response
  baseDelay: 2000, // 2 seconds
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2
};

// Image storage configuration
const IMAGE_CONFIG = {
  storageDir: path.join(process.cwd(), 'public', 'generated-charts'),
  baseUrl: process.env.APP_BASE_URL || 'https://server.tradetimescanner.com',
  urlPath: '/generated-charts'
};

// Ensure storage directory exists
const ensureStorageDirectory = () => {
  if (!fs.existsSync(IMAGE_CONFIG.storageDir)) {
    fs.mkdirSync(IMAGE_CONFIG.storageDir, { recursive: true });
    console.log(`📁 Created storage directory: ${IMAGE_CONFIG.storageDir}`);
  }
};

// Generate unique filename with timestamp
const generateFilename = (marketType: string, signalType?: string) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const randomId = Math.random().toString(36).substring(2, 8);
  const suffix = signalType ? `-${signalType.toLowerCase()}` : '';
  return `chart-${marketType.toLowerCase()}${suffix}-${timestamp}-${randomId}.png`;
};

// Save base64 image to disk
const saveBase64Image = async (base64Data: string, filename: string) => {
  try {
    ensureStorageDirectory();
    // Remove data:image/png;base64, prefix if present
    const cleanBase64 = base64Data.replace(/^data:image\/png;base64,/, '');
    // Convert base64 to buffer and save
    const buffer = Buffer.from(cleanBase64, 'base64');
    const filePath = path.join(IMAGE_CONFIG.storageDir, filename);
    fs.writeFileSync(filePath, buffer);
    // Return public URL
    const publicUrl = `${IMAGE_CONFIG.baseUrl}${IMAGE_CONFIG.urlPath}/${filename}`;
    console.log(`💾 Saved image: ${filename} (${buffer.length} bytes)`);
    console.log(`🌐 Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error saving base64 image:', error);
    throw error;
  }
};

// Download and save image from URL
const saveImageFromUrl = async (imageUrl: string, filename: string) => {
  try {
    ensureStorageDirectory();
    // Download image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    // Save to disk
    const filePath = path.join(IMAGE_CONFIG.storageDir, filename);
    fs.writeFileSync(filePath, buffer);
    // Return public URL
    const publicUrl = `${IMAGE_CONFIG.baseUrl}${IMAGE_CONFIG.urlPath}/${filename}`;
    console.log(`💾 Downloaded and saved image: ${filename} (${buffer.length} bytes)`);
    console.log(`🌐 Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error downloading and saving image:', error);
    throw error;
  }
};

// Helper function for exponential backoff delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to determine if error is retryable
const isRetryableError = (error: any) => {
  // Connection errors
  if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return true;
  }
  // OpenAI API errors that are retryable
  if (error.status) {
    // Rate limiting, server errors, timeouts
    return [429, 500, 502, 503, 504].includes(error.status);
  }
  // Connection error messages
  if (error.message) {
    const retryableMessages = [
      'Connection error',
      'timeout',
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'socket hang up',
      'network error'
    ];
    return retryableMessages.some(msg => error.message.toLowerCase().includes(msg.toLowerCase()));
  }
  return false;
};

// Main image generation function with retry logic
const generateImageWithRetry = async (shortPrompt: string, attempt = 1): Promise<any> => {
  try {
    const response = await openai.images.generate({
      model: "gpt-image-1" as any, // Using type assertion as gpt-image-1 might not be in official types yet
      prompt: shortPrompt,
      size: "1024x1024",
      n: 1,
    });
    console.log(`✅ Success on attempt ${attempt}`);
    return response;
  } catch (error: any) {
    console.error(`❌ Attempt ${attempt} failed:`, error.message);
    // If this is the last attempt or error is not retryable, throw the error
    if (attempt > RETRY_CONFIG.maxRetries || !isRetryableError(error)) {
      throw error;
    }
    // Calculate delay with exponential backoff
    const delayMs = Math.min(RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1), RETRY_CONFIG.maxDelay);
    console.log(`⏳ Retrying in ${delayMs / 1000} seconds... (${error.message})`);
    await delay(delayMs);
    // Recursive retry
    return generateImageWithRetry(shortPrompt, attempt + 1);
  }
};

export const generateChartImage = async (request: ChartGenerationRequest): Promise<string> => {
  try {
    console.log("🎨 Starting chart image generation with retry logic...");
    console.log("📊 Request details:", {
      marketType: request.marketType,
      indicators: request.indicators,
      timeframe: request.timeframe,
    });
    console.log(`🔄 Retry configuration: ${RETRY_CONFIG.maxRetries} retries, exponential backoff`);

    const indicatorsList = request.indicators.join(", ");
    const assetType = getAssetType(request);

    // Determine signal labels based on market type
    const isBinaryOptions = request.marketType.toLowerCase().includes('binary') || request.marketType.toLowerCase().includes('option');
    const bullishLabel = isBinaryOptions ? "CALL" : "BUY";
    const bearishLabel = isBinaryOptions ? "PUT" : "SELL";
    const strategyType = isBinaryOptions ? "binary options" : request.marketType.toLowerCase();

    // Construction of the short prompt optimized for gpt-image-1
    const shortPrompt = `Create a professional dark-theme trading chart for ${request.marketType} showing ${indicatorsList} indicators.

Requirements:
- Dark background like TradingView
- Candlestick chart with realistic price action
- ${indicatorsList} indicators with proper colors (RSI blue, MACD histogram, Bollinger Bands orange)
- BOTH large green "${bullishLabel}" and red "${bearishLabel}" signal markers at different entry points on the same chart
- Show complete strategy with both bullish and bearish scenarios
- Small colored confluence arrows for EACH indicator at BOTH signal candles:
  * ${bullishLabel} candle: green arrows showing bullish indicator alignment (EMA cross up, MACD bullish, RSI from oversold, BB lower band bounce)
  * ${bearishLabel} candle: red arrows showing bearish indicator alignment (EMA cross down, MACD bearish, RSI from overbought, BB upper band bounce)
  * Each arrow labeled with indicator name (EMA, MACD, RSI, etc.)
- Timestamp and price level at signal
- Information panel with asset name, timeframe, and entry conditions
- Professional trading terminal appearance

Asset: ${assetType}
Strategy: ${request.strategyExplanation.substring(0, 200)}...
Entry: ${request.entryConditions.substring(0, 200)}...`;

    console.log("📏 Short prompt length:", shortPrompt.length);

    // Use retry logic for image generation
    const response = await generateImageWithRetry(shortPrompt);
    console.log("✅ Image generation complete using gpt-image-1 with retry logic");

    const base64Image = response.data?.[0]?.b64_json;
    const imageUrl = response.data?.[0]?.url;

    // Generate unique filename
    const filename = generateFilename(request.marketType);

    if (base64Image) {
      console.log("🖼️ Base64 image generated successfully");
      try {
        const publicUrl = await saveBase64Image(`data:image/png;base64,${base64Image}`, filename);
        return publicUrl;
      } catch (saveError) {
        console.error("❌ Failed to save base64 image, returning base64 data:", saveError);
        return `data:image/png;base64,${base64Image}`;
      }
    } else if (imageUrl) {
      console.log("🖼️ Image URL generated successfully");
      try {
        const publicUrl = await saveImageFromUrl(imageUrl, filename);
        return publicUrl;
      } catch (saveError) {
        console.error("❌ Failed to save image from URL, returning original URL:", saveError);
        return imageUrl;
      }
    } else {
      console.warn("⚠️ No image data (base64 or URL) received from API");
      return "https://via.placeholder.com/1536x1024/1a1a1a/ffffff?text=Chart+Generation+Failed";
    }
  } catch (error: any) {
    console.error("❌ Final error after all retry attempts:", error.message);
    
    let errorMessage = "Chart+Generation+Failed";
    if (isRetryableError(error)) {
      errorMessage = "Connection+Error+After+Retries";
    } else if (error.status === 400) {
      errorMessage = "Invalid+Request";
    } else if (error.status === 401) {
      errorMessage = "API+Key+Invalid";
    } else if (error.status === 429) {
      errorMessage = "Rate+Limit+Exceeded";
    }
    
    console.error(`💡 Returning fallback placeholder: ${errorMessage}`);
    return `https://via.placeholder.com/1536x1024/1a1a1a/ffffff?text=${errorMessage}`;
  }
};

export const generateDualCharts = async (request: ChartGenerationRequest) => {
  try {
    console.log("🎨 Starting dual chart generation (separate bullish and bearish charts)...");
    
    // Determine signal labels based on market type
    const isBinaryOptions = request.marketType.toLowerCase().includes('binary') || request.marketType.toLowerCase().includes('option');
    const bullishLabel = isBinaryOptions ? "CALL" : "BUY";
    const bearishLabel = isBinaryOptions ? "PUT" : "SELL";

    // Generate bullish chart
    console.log(`📈 Generating ${bullishLabel} chart...`);
    const bullishChart = await generateSingleDirectionChart(request, bullishLabel, "bullish");

    // Generate bearish chart  
    console.log(`📉 Generating ${bearishLabel} chart...`);
    const bearishChart = await generateSingleDirectionChart(request, bearishLabel, "bearish");

    return {
      bullishChart,
      bearishChart,
      signalLabels: {
        bullish: bullishLabel,
        bearish: bearishLabel
      }
    };
  } catch (error: any) {
    console.error("❌ Dual chart generation failed:", error.message);
    throw error;
  }
};

const generateSingleDirectionChart = async (request: ChartGenerationRequest, signalLabel: string, direction: "bullish" | "bearish"): Promise<string> => {
  try {
    const indicatorsList = request.indicators.join(", ");
    const assetType = getAssetType(request);

    // Determine signal characteristics
    const isBullish = direction === "bullish";
    const signalColor = isBullish ? "green" : "red";
    const priceDirection = isBullish ? "above" : "below";
    const crossDirection = isBullish ? "bullish" : "bearish";
    const rsiCondition = isBullish ? "exits oversold zone (below 30)" : "exits overbought zone (above 70)";
    const bbCondition = isBullish ? "bounces off lower Bollinger Band" : "bounces off upper Bollinger Band";
    const markerPosition = isBullish ? "at the bottom of the candle" : "at the top of the candle";

    // Create optimized prompt for the specific direction
    const shortPrompt = `Create a professional dark-theme trading chart for ${request.marketType} showing ${indicatorsList} indicators with ${signalLabel} signal.

Requirements:
- Dark background like TradingView
- Candlestick chart with realistic price action showing ${direction} trend
- ${indicatorsList} indicators with proper colors (RSI blue, MACD histogram, Bollinger Bands orange)
- Large ${signalColor} "${signalLabel}" signal marker ${markerPosition} at entry point
- Small colored confluence arrows for EACH indicator at signal candle:
  * EMA: ${signalColor} arrows at price crossover points (price ${priceDirection} EMA)
  * MACD: blue arrows at ${crossDirection} crossover in MACD panel
  * RSI: orange arrows when RSI ${rsiCondition}
  * Bollinger Bands: yellow arrows when price ${bbCondition}
  * Each arrow labeled with indicator name (EMA, MACD, RSI, etc.)
- Timestamp and price level at signal
- Information panel with asset name, timeframe, and ${signalLabel} entry conditions
- Professional trading terminal appearance
- Signal marker must be properly aligned ${markerPosition} for clear visibility

Asset: ${assetType}
Signal Type: ${signalLabel}
Direction: ${direction}
Strategy: ${request.strategyExplanation.substring(0, 150)}...
Entry Conditions: Show ${signalLabel} scenario where ${request.entryConditions.substring(0, 150)}...`;

    console.log(`📏 ${signalLabel} prompt length:`, shortPrompt.length);

    // Use retry logic for image generation
    const response = await generateImageWithRetry(shortPrompt);
    console.log(`✅ ${signalLabel} image generation complete`);

    const base64Image = response.data?.[0]?.b64_json;
    const imageUrl = response.data?.[0]?.url;

    // Generate unique filename for this signal type
    const filename = generateFilename(request.marketType, signalLabel.toLowerCase());

    if (base64Image) {
      try {
        const publicUrl = await saveBase64Image(`data:image/png;base64,${base64Image}`, filename);
        return publicUrl;
      } catch (saveError) {
        console.error(`❌ Failed to save ${signalLabel} base64 image:`, saveError);
        return `data:image/png;base64,${base64Image}`;
      }
    } else if (imageUrl) {
      try {
        const publicUrl = await saveImageFromUrl(imageUrl, filename);
        return publicUrl;
      } catch (saveError) {
        console.error(`❌ Failed to save ${signalLabel} image from URL:`, saveError);
        return imageUrl;
      }
    } else {
      return `https://via.placeholder.com/1536x1024/1a1a1a/ffffff?text=${signalLabel}+Chart+Generation+Failed`;
    }
  } catch (error: any) {
    console.error(`❌ ${signalLabel} chart generation failed:`, error.message);
    throw error;
  }
};

const getAssetType = (request: ChartGenerationRequest): string => {
  if (request.recommendedPairs?.length) return request.recommendedPairs[0];
  if (request.recommendedCoins?.length) return request.recommendedCoins[0];
  if (request.recommendedIndices?.length) return request.recommendedIndices[0];

  switch (request.marketType.toLowerCase()) {
    case "forex": return "EUR/USD";
    case "crypto":
    case "cryptocurrency": return "BTC/USD";
    case "gold": return "XAU/USD";
    case "indices": return "US30";
    default: return "EUR/USD";
  }
};
