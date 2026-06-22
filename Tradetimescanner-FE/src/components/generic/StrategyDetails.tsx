import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaClock,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { ResponsiveImage } from "../responsive/ResponsiveImage";
import { LazyWrapper } from "../responsive/LazyWrapper";
import ImageModal from "./ImageModal";
import SimpleTradingChart from "./SimpleTradingChart";
import { getPairRecommendations } from "../../services/tradeTime";
import { baseURL } from "../../utils/URL";

interface StrategyDetailsProps {
  strategyData: {
    recommendedIndicators:
    | Array<{
      name: string;
      settings?: string;
      role?: string;
      explanation?: string;
    }>
    | string;
    recommendedPairs?:
    | Array<{
      pair: string;
      rationale?: string;
    }>
    | string;
    recommendedAssets?: Array<{
      asset: string;
      rationale?: string;
    }>;
    recommendedStocks?: Array<{
      stock: string;
      rationale?: string;
    }>;
    recommendedCryptos?: Array<{
      crypto: string;
      rationale?: string;
    }>;
    strategyExplanation?: string;
    tradePlan?: {
      entryConditions?: string;
      // Either options-style fields
      expiryDurations?: string[];
      tradeDuration?: string;
      // Or forex/crypto-style fields
      stopLoss?: string;
      takeProfit?: string[];
      holdingStyle?: string;
      tradeTime?: string;
      // Common
      timeframe?: string;
      timeFrame?: string;
      [key: string]: any;
    };
    signal_annotation?: string | string[]; // Base64 image string or array of images
    chartAnnotations?: {
      markers: Array<{
        time: string;
        position: "aboveBar" | "belowBar";
        color: string;
        shape: "arrowUp" | "arrowDown" | "circle" | "square";
        text: string;
        size: number;
      }>;
      indicatorOverlays: Array<{
        name: string;
        type: "line" | "histogram";
        data: Array<{
          time: string;
          value: number;
        }>;
        color: string;
        lineWidth: number;
      }>;
      trendLines: Array<{
        startTime: string;
        endTime: string;
        startPrice: number;
        endPrice: number;
        color: string;
        lineWidth: number;
        lineStyle: "solid" | "dashed" | "dotted";
        text: string;
      }>;
      zones: Array<{
        startTime: string;
        endTime: string;
        startPrice: number;
        endPrice: number;
        color: string;
        opacity: number;
        text: string;
      }>;
    };
    chartAnnotation?: string; // Legacy field for backward compatibility
    // Legacy fields for backward compatibility
    recommendedtradetime?: string;
    recommendedtimeframe?: string;
    strategyexplanation?: string;
  };
  selectedCategory?: string;
}

const StrategyDetails: React.FC<StrategyDetailsProps> = ({
  strategyData,
  selectedCategory,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    timeframe: false,
    tradeDuration: false,
    expiryOptions: false,
  });

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pairRecommendations, setPairRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Fetch pair recommendations on component mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const response = await getPairRecommendations();
        if (response.success && response.data) {
          setPairRecommendations(response.data);
        }
      } catch (error) {
        console.error("Error fetching pair recommendations:", error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Convert signal_annotation to array for consistent handling
  const parseSignalAnnotation = (annotation: string | string[] | undefined): string[] => {
    if (!annotation) return [];
    if (Array.isArray(annotation)) return annotation;
    try {
      // Try parsing as JSON string array
      const parsed = JSON.parse(annotation);
      if (Array.isArray(parsed)) return parsed;
      return [annotation];
    } catch (e) {
      return [annotation];
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("http")) return url;
    const base = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    return `${base}${cleanUrl}`;
  };

  const signalImages = parseSignalAnnotation(strategyData.signal_annotation).map(getImageUrl);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Parse recommendedIndicators if it's a string
  const parseIndicators = () => {
    try {
      if (typeof strategyData.recommendedIndicators === "string") {
        return JSON.parse(strategyData.recommendedIndicators);
      }
      return strategyData.recommendedIndicators || [];
    } catch (error) {
      console.error("Error parsing recommendedIndicators:", error);
      return [];
    }
  };

  // Parse recommendedPairs if it's a string
  const parsePairs = () => {
    try {
      if (typeof strategyData.recommendedPairs === "string") {
        return JSON.parse(strategyData.recommendedPairs);
      }
      return strategyData.recommendedPairs || [];
    } catch (error) {
      console.error("Error parsing recommendedPairs:", error);
      return [];
    }
  };

  const indicators = parseIndicators();
  const pairs = parsePairs();

  // Get appropriate data based on selected category
  const getRecommendedData = () => {
    switch (selectedCategory) {
      case "Options Strategy":
        return {
          data: pairs,
          title: "Recommended Currency Pairs",
          icon: "💱",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-600",
          itemTextColor: "text-blue-700",
          validPairs: [
            "EURUSD",
            "GBPUSD",
            "USDJPY",
            "USDCAD",
            "AUDUSD",
            "NZDUSD",
          ],
        };
      case "Forex Strategy":
        return {
          data: pairs,
          title: "Recommended Currency Pairs",
          icon: "💹",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-600",
          itemTextColor: "text-green-700",
          validPairs: [
            "EURUSD",
            "GBPUSD",
            "USDJPY",
            "USDCAD",
            "AUDUSD",
            "NZDUSD",
            "EURGBP",
            "EURJPY",
            "GBPJPY",
            "USDCHF",
          ],
        };
      case "Crypto Strategy":
        return {
          data: strategyData.recommendedCryptos || pairs,
          title: "Recommended Cryptocurrencies",
          icon: "₿",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-600",
          itemTextColor: "text-orange-700",
          validPairs: [
            "BTCUSD",
            "ETHUSD",
            "ADAUSD",
            "SOLUSD",
            "DOTUSD",
            "LINKUSD",
            "LTCUSD",
            "XRPUSD",
          ],
        };
      case "Stock Strategy":
        return {
          data: strategyData.recommendedStocks || pairs,
          title: "Recommended Stocks",
          icon: "📈",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          textColor: "text-purple-600",
          itemTextColor: "text-purple-700",
          validPairs: [
            "AAPL",
            "GOOGL",
            "MSFT",
            "AMZN",
            "TSLA",
            "NVDA",
            "META",
            "NFLX",
            "SPY",
            "QQQ",
          ],
        };
      case "Commodity Strategy":
        return {
          data: strategyData.recommendedAssets || pairs,
          title: "Recommended Commodities",
          icon: "🥇",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-600",
          itemTextColor: "text-yellow-700",
          validPairs: [
            "XAUUSD",
            "XAGUSD",
            "WTIUSD",
            "NATGAS",
            "COPPER",
            "PLATINUM",
          ],
        };
      default:
        return {
          data: pairs,
          title: "Recommended Assets",
          icon: "📊",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-600",
          itemTextColor: "text-blue-700",
          validPairs: [],
        };
    }
  };

  const recommendedData = getRecommendedData();

  // Debug logging to check if signal_annotation exists
  console.log("StrategyData:", strategyData);
  console.log("Signal annotation exists:", !!strategyData.signal_annotation);
  console.log("Signal annotation URL:", strategyData.signal_annotation);
  console.log("Selected Category:", selectedCategory);

  return (
    <div className="space-y-6">
      {/* Recommended Indicators */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaChartLine className="text-indigo-600" />
          Recommended Settings ({indicators?.length || 0})
        </h4>

        {indicators && indicators.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {indicators.map((indicator: any, index: number) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg mb-2"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800 text-left">
                      {indicator.name}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {indicator.settings && (
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">
                          Input Settings:
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {indicator.settings}
                        </p>
                      </div>
                    )}
                    {indicator.role && (
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">
                          Role in Strategy:
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {indicator.role}
                        </p>
                      </div>
                    )}
                    {/* Fallback for legacy explanation field */}
                    {indicator.explanation && (
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">
                          {indicator.settings || indicator.role
                            ? "Additional Info:"
                            : "Explanation:"}
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {indicator.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaChartLine className="mx-auto text-4xl mb-2 opacity-50" />
            <p>No indicators recommended</p>
          </div>
        )}
        {/* Signal Annotation Image Slider */}
        {/* {signalImages.length > 0 && (
          <div className="my-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaChartLine className="text-indigo-600" />
                <h4 className="font-bold text-gray-800 text-lg">
                  Trading Chart Annotation
                </h4>
              </div>
            </div>
          </div>
        )} */}
{/* Both commented because it takes time to generate images from backend */}
        {/* Interactive Chart */}
        {/* {(strategyData.chartAnnotations || signalImages.length > 0) && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl py-2 shadow-lg mt-4">
            <SimpleTradingChart
              setIsImageModalOpen={setIsImageModalOpen}
              signal_annotation={signalImages}
              chartAnnotations={strategyData.chartAnnotations}
              height={500}
            />
          </div>
        )} */}

        {/* Strategy Explanation */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FaInfoCircle className="text-yellow-600" />
            <h4 className="font-semibold text-gray-800">
              Strategy Explanation
            </h4>
          </div>
          <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none">
            <ReactMarkdown>
              {(
                strategyData.strategyExplanation ||
                strategyData.strategyexplanation ||
                ""
              ).replace(/\\n/g, "\n")}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Trade Plan */}
      {strategyData.tradePlan && (
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FaInfoCircle className="text-green-600" />
            <h4 className="font-semibold text-gray-800">Trade Plan</h4>
          </div>

          <div className="space-y-4">
            {/* Entry Conditions */}
            {strategyData.tradePlan.entryConditions && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h5 className="font-medium text-gray-800 mb-2">
                  Entry Conditions:
                </h5>
                <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {(strategyData.tradePlan.entryConditions || "").replace(
                      /\\n/g,
                      "\n"
                    )}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Trade Parameters Grid (Options-style fields) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Time Frame */}
              {strategyData.tradePlan.timeframe && (
                <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection("timeframe")}
                    className="w-full flex items-center justify-between p-3 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-green-600" />
                      <h5 className="font-medium text-gray-800">Time Frame</h5>
                    </div>
                    {expandedSections.timeframe ? (
                      <FaChevronUp className="text-green-600" />
                    ) : (
                      <FaChevronDown className="text-green-600" />
                    )}
                  </button>
                  {expandedSections.timeframe && (
                    <div className="px-3 pb-3 border-t border-green-100">
                      <p className="text-gray-700 text-sm mt-2">
                        {strategyData.tradePlan.timeframe}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Trade Duration */}
              {strategyData.tradePlan.tradeDuration && (
                <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection("tradeDuration")}
                    className="w-full flex items-center justify-between p-3 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FaClock className="text-green-600" />
                      <h5 className="font-medium text-gray-800">
                        Trade Duration
                      </h5>
                    </div>
                    {expandedSections.tradeDuration ? (
                      <FaChevronUp className="text-green-600" />
                    ) : (
                      <FaChevronDown className="text-green-600" />
                    )}
                  </button>
                  {expandedSections.tradeDuration && (
                    <div className="px-3 pb-3 border-t border-green-100">
                      <p className="text-gray-700 text-sm mt-2">
                        {strategyData.tradePlan.tradeDuration}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Expiry Durations */}
              {strategyData.tradePlan.expiryDurations && (
                <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection("expiryOptions")}
                    className="w-full flex items-center justify-between p-3 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FaClock className="text-green-600" />
                      <h5 className="font-medium text-gray-800">
                        Expiry Options
                      </h5>
                    </div>
                    {expandedSections.expiryOptions ? (
                      <FaChevronUp className="text-green-600" />
                    ) : (
                      <FaChevronDown className="text-green-600" />
                    )}
                  </button>
                  {expandedSections.expiryOptions && (
                    <div className="px-3 pb-3 border-t border-green-100">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {strategyData.tradePlan.expiryDurations?.map(
                          (duration: string, index: number) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {duration}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional sections for forex/crypto-style fields */}
            {strategyData.tradePlan.stopLoss && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h5 className="font-medium text-gray-800 mb-2">Stop Loss:</h5>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {strategyData.tradePlan.stopLoss}
                </p>
              </div>
            )}

            {strategyData.tradePlan.takeProfit && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h5 className="font-medium text-gray-800 mb-2">Take Profit:</h5>
                <div className="flex flex-wrap gap-2 mt-1">
                  {strategyData.tradePlan.takeProfit.map(
                    (tp: string, index: number) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tp}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {strategyData.tradePlan.holdingStyle && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h5 className="font-medium text-gray-800 mb-2">
                  Holding Style:
                </h5>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {strategyData.tradePlan.holdingStyle}
                </p>
              </div>
            )}

            {strategyData.tradePlan.tradeTime && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <FaClock className="text-green-600" />
                  Trade Time:
                </h5>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {strategyData.tradePlan.tradeTime}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommended Assets (Dynamic based on category) */}
      {recommendedData.data && recommendedData.data.length > 0 && (
        <div className={`${recommendedData.bgColor} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xl"
              role="img"
              aria-label={recommendedData.title}
            >
              {recommendedData.icon}
            </span>
            <h4 className="font-semibold text-gray-800">
              {recommendedData.title} ({recommendedData.data.length})
            </h4>
            {selectedCategory && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${recommendedData.bgColor} ${recommendedData.textColor} border ${recommendedData.borderColor}`}
              >
                {selectedCategory}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendedData.data.map((item: any, index: number) => {
              // Handle different property names (pair, asset, stock, crypto)
              const itemName =
                item.pair ||
                item.asset ||
                item.stock ||
                item.crypto ||
                item.symbol ||
                "Unknown";
              const isValidForCategory =
                recommendedData.validPairs.length === 0 ||
                recommendedData.validPairs.includes(itemName);

              // Find recommendation for this pair
              const recommendation = pairRecommendations.find(
                (rec: any) => rec.pair === itemName
              );
              const isRecommended = recommendation?.status === "Recommended";

              return (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-4 border ${recommendedData.borderColor
                    } ${!isValidForCategory ? "opacity-75 border-dashed" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`${recommendedData.itemTextColor} font-semibold text-lg`}
                    >
                      {itemName}
                    </span>
                    {!isValidForCategory && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Custom
                      </span>
                    )}
                    {/* Trade Time Recommendation Badge */}
                    {recommendation && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${isRecommended
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-gray-100 text-gray-600 border border-gray-300"
                          }`}
                      >
                        {recommendation.status}
                      </span>
                    )}
                  </div>
                  {(item.rationale || recommendation?.reason) && (
                    <div className="space-y-1">
                      {item.rationale && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.rationale}
                        </p>
                      )}
                      {recommendation?.reason && (
                        <p className="text-gray-700 text-sm leading-relaxed flex items-start gap-1">
                          <FaClock className="text-blue-600 mt-1 flex-shrink-0" size={12} />
                          <span>{recommendation.reason}</span>
                        </p>
                      )}
                    </div>
                  )}
                  {/* Show category-specific additional info */}
                  {selectedCategory === "Stock Strategy" && item.sector && (
                    <p className="text-xs text-gray-500 mt-1">
                      Sector: {item.sector}
                    </p>
                  )}
                  {selectedCategory === "Crypto Strategy" && item.marketCap && (
                    <p className="text-xs text-gray-500 mt-1">
                      Market Cap: {item.marketCap}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Category-specific tips */}
          <div
            className={`mt-4 p-3 ${recommendedData.bgColor} border ${recommendedData.borderColor} rounded-lg`}
          >
            <p className="text-sm text-gray-700">
              {selectedCategory === "Options Strategy" &&
                "💡 Focus on high-volume pairs during active trading sessions for better price action."}
              {selectedCategory === "Forex Strategy" &&
                "💡 Consider economic calendar events and session overlaps for optimal trading opportunities."}
              {selectedCategory === "Crypto Strategy" &&
                "💡 Monitor market sentiment and regulatory news that may impact cryptocurrency prices."}
              {selectedCategory === "Stock Strategy" &&
                "💡 Check earnings calendars and sector rotation trends for better stock selection."}
              {selectedCategory === "Commodity Strategy" &&
                "💡 Watch for supply/demand factors and geopolitical events affecting commodity prices."}
              {!selectedCategory &&
                "💡 Diversify across different assets to manage risk effectively."}
            </p>
          </div>
        </div>
      )}

      {strategyData.chartAnnotation && !strategyData.chartAnnotations && (
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FaChartLine className="text-purple-600" />
            <h4 className="font-semibold text-gray-800">Chart Annotation</h4>
            <span
              onClick={() => setIsImageModalOpen(true)}
              className="text-sm text-gray-500 ml-auto"
            >
              Click to enlarge
            </span>
          </div>
          <div className="bg-white rounded-lg p-3 border border-purple-200">
            <img
              src={getImageUrl(strategyData.chartAnnotation)}
              alt="Strategy Chart Annotation"
              className="w-full h-auto rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsImageModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Legacy Trading Parameters - Fallback */}
      {(strategyData.recommendedtradetime ||
        strategyData.recommendedtimeframe) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategyData.recommendedtradetime && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-blue-600" />
                  <h4 className="font-semibold text-gray-800">Trading Time</h4>
                </div>
                <p className="text-gray-700">
                  {strategyData.recommendedtradetime}
                </p>
              </div>
            )}

            {strategyData.recommendedtimeframe && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaChartLine className="text-green-600" />
                  <h4 className="font-semibold text-gray-800">Timeframe</h4>
                </div>
                <p className="text-gray-700">
                  {strategyData.recommendedtimeframe}
                </p>
              </div>
            )}
          </div>
        )}

      {/* Image Modal */}
      {(signalImages.length > 0 || strategyData.chartAnnotation) && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          src={
            signalImages.length > 0
              ? signalImages
              : strategyData.chartAnnotation || ""
          }
          alt="Trading Chart Annotation"
          title="Trading Chart Annotation"
        />
      )}
    </div>
  );
};

export default StrategyDetails;
