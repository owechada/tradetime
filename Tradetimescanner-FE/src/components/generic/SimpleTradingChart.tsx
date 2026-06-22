import React, { useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { LazyWrapper } from "../responsive/LazyWrapper";
import { FaChartLine } from "react-icons/fa";
import { ResponsiveImage } from "../responsive/ResponsiveImage";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { baseURL } from "../../utils/URL";

interface ChartMarker {
  time: string;
  position: "belowBar" | "aboveBar";
  color: string;
  shape: "arrowUp" | "arrowDown" | "circle" | "square";
  text: string;
  size: number;
}

interface IndicatorOverlay {
  name: string;
  type: "line" | "histogram";
  data: Array<{
    time: string;
    value: number;
  }>;
  color: string;
  lineWidth: number;
}

interface TrendLine {
  startTime: string;
  endTime: string;
  startPrice: number;
  endPrice: number;
  color: string;
  lineWidth: number;
  lineStyle: "solid" | "dashed" | "dotted";
  text: string;
}

interface Zone {
  startTime: string;
  endTime: string;
  startPrice: number;
  endPrice: number;
  color: string;
  opacity: number;
  text: string;
}

export interface ChartAnnotations {
  markers?: ChartMarker[];
  indicatorOverlays?: IndicatorOverlay[];
  trendLines?: TrendLine[];
  zones?: Zone[];
}

interface SimpleTradingChartProps {
  chartAnnotations?: ChartAnnotations;
  signal_annotation: string | string[];
  setIsImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  height?: number;
}

const SimpleTradingChart: React.FC<SimpleTradingChartProps> = ({
  chartAnnotations,
  signal_annotation,
  setIsImageModalOpen,
  height = 400,
}) => {
  // Responsive height adjustment
  const getResponsiveHeight = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return Math.min(height, 300); // Mobile
      if (width < 1024) return Math.min(height, 400); // Tablet
      return height; // Desktop
    }
    return height;
  };

  // Convert timestamp to readable date
  const formatTime = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate sample candlestick data based on the annotations
  const generateSampleData = () => {
    const times = [
      "1698783600",
      "1698787200",
      "1698790800",
      "1698794400",
      "1698798000",
    ];
    return times.map((time, index) => ({
      time: formatTime(time),
      timestamp: time,
      open: 1.234 + index * 0.001,
      high: 1.236 + index * 0.001,
      low: 1.233 + index * 0.001,
      close: 1.235 + index * 0.001,
      volume: 1000 + index * 200,
    }));
  };

  const data = generateSampleData();

  // Prepare indicator data
  const getIndicatorData = (indicatorName: string) => {
    const indicator = chartAnnotations?.indicatorOverlays?.find(
      (ind) => ind.name === indicatorName
    );
    if (!indicator) return [];

    return indicator.data.map((point) => ({
      time: formatTime(point.time),
      timestamp: point.time,
      [indicatorName.toLowerCase().replace(" ", "")]: point.value,
    }));
  };

  const bollingerData = getIndicatorData("Bollinger Bands");
  const rsiData = getIndicatorData("RSI");
  const macdData = getIndicatorData("MACD");



  // Parse signal_annotation to handle string, array, or JSON string
  const parseSignalAnnotation = (annotation: string | string[]): string[] => {
    if (Array.isArray(annotation)) return annotation;
    if (!annotation) return [];
    try {
      // Try parsing as JSON string array
      const parsed = JSON.parse(annotation);
      if (Array.isArray(parsed)) return parsed;
      return [annotation];
    } catch (e) {
      return [annotation];
    }
  };

  const signalImages = parseSignalAnnotation(signal_annotation);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("http")) return url;
    // Prefix relative paths with baseURL, ensure no double slash
    const base = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    return `${base}${cleanUrl}`;
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % signalImages.length);
  };
  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + signalImages.length) % signalImages.length);
  };


  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
      {/* Chart Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>

            <p className="text-gray-300 text-xs sm:text-sm">
              Strategy Analysis Chart
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-right">
              <div className="text-green-400 text-base sm:text-lg font-bold">
                1.2345
              </div>
              <div className="text-gray-400 text-xs">+0.0025 (+0.20%)</div>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-xs sm:text-sm">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="bg-gray-800 px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-600">
        <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
          {chartAnnotations?.markers && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                <span className="text-gray-300 font-medium">CALL Signals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                <span className="text-gray-300 font-medium">PUT Signals</span>
              </div>
            </>
          )}
          {chartAnnotations?.indicatorOverlays?.map((indicator, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-0.5 rounded shadow-sm"
                style={{ backgroundColor: indicator.color }}
              ></div>
              <span className="text-gray-300 font-medium">
                {indicator.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-gray-900 p-2 sm:p-4">
        {/* <ResponsiveContainer width="100%" height={getResponsiveHeight()}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={10}
              tick={{ fill: '#9CA3AF' }}
              axisLine={{ stroke: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['dataMin - 0.002', 'dataMax + 0.002']}
              stroke="#9CA3AF"
              fontSize={10}
              tick={{ fill: '#9CA3AF' }}
              axisLine={{ stroke: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
              tickFormatter={(value) => value.toFixed(4)}
              width={60}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
              }}
              labelStyle={{ color: '#F9FAFB' }}
              formatter={(value: any, name: string) => [
                typeof value === 'number' ? value.toFixed(4) : value, 
                name
              ]}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px', 
                color: '#F9FAFB',
                fontSize: '12px'
              }}
            />

           <Bar 
            dataKey="high" 
            fill="#10B981" 
            name="High" 
            opacity={0.4}
            radius={[1, 1, 0, 0]}
          />
          <Bar 
            dataKey="low" 
            fill="#EF4444" 
            name="Low" 
            opacity={0.4}
            radius={[0, 0, 1, 1]}
          />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#F59E0B" 
            strokeWidth={3}
            name="Close Price"
            dot={false}
            activeDot={{ r: 6, fill: '#F59E0B', stroke: '#1F2937', strokeWidth: 2 }}
          />

           {chartAnnotations?.indicatorOverlays?.map((indicator, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={indicator.name.toLowerCase().replace(' ', '')}
              stroke={indicator.color}
              strokeWidth={indicator.lineWidth + 1}
              name={indicator.name}
              dot={false}
              strokeDasharray={indicator.name === 'RSI' ? '5 5' : indicator.name === 'Bollinger Bands' ? '3 3' : undefined}
              activeDot={{ r: 4, fill: indicator.color, stroke: '#1F2937', strokeWidth: 2 }}
            />
          ))}

           {chartAnnotations?.trendLines?.map((trendLine, index) => (
            <ReferenceLine
              key={index}
              y={trendLine.startPrice}
              stroke={trendLine.color}
              strokeWidth={trendLine.lineWidth + 1}
              strokeDasharray={trendLine.lineStyle === 'dashed' ? '8 4' : undefined}
              label={{ 
                value: trendLine.text, 
                position: 'top',
                style: { 
                  fill: trendLine.color, 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }
              }}
            />
          ))}

           {chartAnnotations?.zones?.map((zone, index) => (
            <ReferenceArea
              key={index}
              y1={zone.startPrice}
              y2={zone.endPrice}
              fill={zone.color}
              fillOpacity={zone.opacity}
              stroke={zone.color}
              strokeWidth={1}
              strokeDasharray="4 4"
              label={{ 
                value: zone.text, 
                position: 'top',
                style: { 
                  fill: '#F9FAFB', 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }
              }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer> */}

        {signalImages.length > 0 && (
          <LazyWrapper
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl    shadow-lg"
            minHeight="200px"
          >
            <div className="flex items-center justify-between gap-2 p-4 mb-4">
              <FaChartLine className="text-indigo-600" />

                <button
                      onClick={() => setIsImageModalOpen(true)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View Fullscreen
                    </button>
            </div>
            <div
              className="bg-white rounded-lg p-2 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsImageModalOpen(true)}
            >



              {/* Signal Annotation Image Slider */}
             
<div className="relative bg-black">
              <ResponsiveImage
                src={getImageUrl(signalImages[currentImageIndex])}
                alt="Trading Chart"
                className="w-full h-auto rounded-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                onError={() => {
                  console.error("Failed to load image:", signalImages[currentImageIndex]);
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", signalImages[currentImageIndex]);
                }}
              />

              {/* Navigation Arrows - Only show if multiple images */}
                <div className=' flex absolute top-1/2 justify-between w-full'>
                {signalImages.length > 1 && (
                          <>
                            {/* Previous Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrevious();
                              }}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              title="Previous (←)"
                            >
                              <MdChevronLeft size={28} className="text-gray-800" />
                            </button>
              
                            {/* Next Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              title="Next (→)"
                            >
                              <MdChevronRight size={28} className="text-gray-800" />
                            </button>
                          </>
                        )}
              
                </div>
                
                </div>
            </div>
          </LazyWrapper>
        )}
      </div>

      {chartAnnotations?.markers && chartAnnotations.markers.length > 0 && (
        <div className="bg-gray-800 border-t border-gray-600 px-6 py-4">
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            Trading Signals
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {chartAnnotations.markers.map((marker, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                    style={{ backgroundColor: marker.color }}
                  >
                    {marker.shape === "arrowUp" ? "↑" : "↓"}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{marker.text}</div>
                    <div className="text-gray-400 text-xs">
                      {formatTime(marker.time)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs capitalize">
                    {marker.position}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {chartAnnotations?.indicatorOverlays &&
        chartAnnotations.indicatorOverlays.length > 0 && (
          <div className="bg-gray-800 border-t border-gray-600 px-6 py-4">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Technical Indicators
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartAnnotations.indicatorOverlays.map((indicator, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-0.5 rounded shadow-sm"
                      style={{ backgroundColor: indicator.color }}
                    ></div>
                    <span className="font-bold text-white">
                      {indicator.name}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div>
                      Type:{" "}
                      <span className="text-gray-300 capitalize">
                        {indicator.type}
                      </span>
                    </div>
                    <div>
                      Data Points:{" "}
                      <span className="text-gray-300">
                        {indicator.data.length}
                      </span>
                    </div>
                    <div>
                      Line Width:{" "}
                      <span className="text-gray-300">
                        {indicator.lineWidth}px
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default SimpleTradingChart;
