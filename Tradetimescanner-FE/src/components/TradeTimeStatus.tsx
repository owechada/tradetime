import React, { useEffect, useState } from "react";
import { getMarketStatus } from "../services/tradeTime";
import { FaClock, FaChartLine, FaInfoCircle } from "react-icons/fa";
import { useResponsive } from "../hooks/useResponsive";

interface MarketStatusData {
  activeSessions: string[];
  liquidity: string;
  status: string;
  explanation: string;
  currentUtcTime?: string;
}

interface TradeTimeStatusProps {
  onStatusChange?: (isActive: boolean) => void;
}

const TradeTimeStatus: React.FC<TradeTimeStatusProps> = ({ onStatusChange }) => {
  const [marketStatus, setMarketStatus] = useState<MarketStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    fetchMarketStatus();
  }, []);

  const fetchMarketStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMarketStatus();
      
      if (response.success && response.data) {
        setMarketStatus(response.data);
        // Notify parent component about market status
        if (onStatusChange) {
          onStatusChange(response.data.status === "Active");
        }
      } else {
        setError("Failed to fetch market status");
      }
    } catch (err: any) {
      console.error("Error fetching market status:", err);
      setError(err?.message || "Failed to fetch market status");
    } finally {
      setLoading(false);
    }
  };

  // Get liquidity color
  const getLiquidityColor = (liquidity: string) => {
    switch (liquidity) {
      case "Very High":
        return "bg-green-100 text-green-800 border-green-300";
      case "High":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Low":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-red-100 text-red-800 border-red-300";
  };

  if (loading) {
    return (
      <div
        className={`bg-blue-50 rounded-lg border border-blue-200 ${
          isMobile ? "p-3 mb-3" : "p-4 mb-4"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <FaClock className="text-blue-600 animate-spin" />
          <p className={`text-blue-700 ${isMobile ? "text-sm" : "text-base"}`}>
            Checking market status...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-yellow-50 rounded-lg border border-yellow-200 ${
          isMobile ? "p-3 mb-3" : "p-4 mb-4"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <FaInfoCircle className="text-yellow-600" />
          <h4 className={`font-semibold text-yellow-800 ${isMobile ? "text-sm" : "text-base"}`}>
            Market Status Unavailable
          </h4>
        </div>
        <p className={`text-yellow-700 ${isMobile ? "text-xs" : "text-sm"}`}>{error}</p>
      </div>
    );
  }

  if (!marketStatus) return null;

  const isDead = marketStatus.status === "Dead";

  return (
    <div
      className={`rounded-lg border ${
        isDead
          ? "bg-red-50 border-red-200"
          : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
      } ${isMobile ? "p-3 mb-3" : "p-4 mb-4"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <FaClock className={isDead ? "text-red-600" : "text-blue-600"} size={isMobile ? 18 : 20} />
        <h3
          className={`font-bold ${isDead ? "text-red-800" : "text-blue-800"} ${
            isMobile ? "text-base" : "text-lg"
          }`}
        >
          Trade Time Analysis
        </h3>
      </div>

      {/* Active Sessions */}
      <div className="mb-3">
        <p
          className={`font-medium text-gray-700 mb-2 ${isMobile ? "text-xs" : "text-sm"}`}
        >
          Active Trading Sessions:
        </p>
        <div className="flex flex-wrap gap-2">
          {marketStatus.activeSessions.length > 0 ? (
            marketStatus.activeSessions.map((session, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 font-medium ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                <FaChartLine size={isMobile ? 10 : 12} />
                {session}
              </span>
            ))
          ) : (
            <span
              className={`text-gray-500 italic ${isMobile ? "text-xs" : "text-sm"}`}
            >
              No active sessions
            </span>
          )}
        </div>
      </div>

      {/* Liquidity and Status */}
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-2 gap-3"} mb-3`}>
        {/* Liquidity */}
        <div>
          <p
            className={`font-medium text-gray-700 mb-1 ${isMobile ? "text-xs" : "text-sm"}`}
          >
            Liquidity Level:
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-lg border font-semibold ${getLiquidityColor(
              marketStatus.liquidity
            )} ${isMobile ? "text-xs" : "text-sm"}`}
          >
            {marketStatus.liquidity}
          </span>
        </div>

        {/* Market Status */}
        <div>
          <p
            className={`font-medium text-gray-700 mb-1 ${isMobile ? "text-xs" : "text-sm"}`}
          >
            Market Status:
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-lg border font-semibold ${getStatusColor(
              marketStatus.status
            )} ${isMobile ? "text-xs" : "text-sm"}`}
          >
            {marketStatus.status}
          </span>
        </div>
      </div>

      {/* Explanation */}
      <div
        className={`rounded-lg border p-3 ${
          isDead
            ? "bg-red-100 border-red-300"
            : "bg-white border-blue-200"
        }`}
      >
        <div className="flex items-start gap-2">
          <FaInfoCircle
            className={`${isDead ? "text-red-600" : "text-blue-600"} mt-1 flex-shrink-0`}
            size={isMobile ? 14 : 16}
          />
          <p
            className={`${isDead ? "text-red-800" : "text-gray-700"} leading-relaxed ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            {marketStatus.explanation}
          </p>
        </div>
      </div>

      {/* Dead Market Warning */}
      {isDead && (
        <div className="mt-3 bg-red-200 border border-red-400 rounded-lg p-3">
          <p
            className={`text-red-900 font-bold text-center ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            ⚠️ Signal generation is disabled during inactive market hours
          </p>
        </div>
      )}
    </div>
  );
};

export default TradeTimeStatus;
