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
        className={`bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg ${
          isMobile ? "p-4 mb-4" : "p-5 mb-5"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 rounded-full border-2 border-blue-200" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          </div>
          <p className={`text-gray-600 font-medium ${isMobile ? "text-sm" : "text-sm"}`}>
            Checking market status...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-amber-50/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg ${
          isMobile ? "p-4 mb-4" : "p-5 mb-5"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <FaInfoCircle className="text-amber-500" />
          <h4 className={`font-bold text-amber-800 ${isMobile ? "text-sm" : "text-sm"}`}>
            Market Status Unavailable
          </h4>
        </div>
        <p className={`text-amber-700 ${isMobile ? "text-xs" : "text-sm"}`}>{error}</p>
      </div>
    );
  }

  if (!marketStatus) return null;

  const isDead = marketStatus.status === "Dead";

  return (
    <div
      className={`rounded-2xl border backdrop-blur-xl shadow-lg transition-all duration-300 ${
        isDead
          ? "bg-red-50/80 border-red-200/60"
          : "bg-white/60 border-white/50"
      } ${isMobile ? "p-4 mb-4" : "p-5 mb-5"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isDead ? "bg-red-100" : "bg-gradient-to-br from-primary/10 to-blue-500/10"}`}>
            <FaClock className={isDead ? "text-red-500" : "text-primary"} size={isMobile ? 14 : 16} />
          </div>
          <h3
            className={`font-bold ${isDead ? "text-red-800" : "text-gray-900"} ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            Trade Time Analysis
          </h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold ${getStatusColor(
            marketStatus.status
          )} ${isMobile ? "text-xs" : "text-xs"}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${marketStatus.status === "Active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          {marketStatus.status}
        </span>
      </div>

      {/* Active Sessions */}
      <div className="mb-4">
        <p
          className={`font-medium text-gray-500 mb-2 ${isMobile ? "text-xs" : "text-xs"} uppercase tracking-wider`}
        >
          Active Sessions
        </p>
        <div className="flex flex-wrap gap-2">
          {marketStatus.activeSessions.length > 0 ? (
            marketStatus.activeSessions.map((session, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/60 font-medium ${
                  isMobile ? "text-xs" : "text-xs"
                }`}
              >
                <FaChartLine size={isMobile ? 9 : 10} />
                {session}
              </span>
            ))
          ) : (
            <span
              className={`text-gray-400 italic ${isMobile ? "text-xs" : "text-sm"}`}
            >
              No active sessions
            </span>
          )}
        </div>
      </div>

      {/* Liquidity and Status */}
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-2 gap-3"} mb-4`}>
        <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
          <p
            className={`font-medium text-gray-500 mb-1.5 ${isMobile ? "text-xs" : "text-xs"} uppercase tracking-wider`}
          >
            Liquidity
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-lg border font-semibold ${getLiquidityColor(
              marketStatus.liquidity
            )} ${isMobile ? "text-xs" : "text-sm"}`}
          >
            {marketStatus.liquidity}
          </span>
        </div>

        <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
          <p
            className={`font-medium text-gray-500 mb-1.5 ${isMobile ? "text-xs" : "text-xs"} uppercase tracking-wider`}
          >
            Market Status
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
        className={`rounded-xl border p-3 ${
          isDead
            ? "bg-red-50/80 border-red-200/60"
            : "bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-gray-200/60"
        }`}
      >
        <div className="flex items-start gap-2">
          <FaInfoCircle
            className={`${isDead ? "text-red-500" : "text-primary/60"} mt-0.5 flex-shrink-0`}
            size={isMobile ? 12 : 14}
          />
          <p
            className={`${isDead ? "text-red-700" : "text-gray-600"} leading-relaxed ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            {marketStatus.explanation}
          </p>
        </div>
      </div>

      {/* Dead Market Warning */}
      {isDead && (
        <div className="mt-3 bg-red-100/80 border border-red-300/60 rounded-xl p-3">
          <p
            className={`text-red-800 font-bold text-center ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            Signal generation is disabled during inactive market hours
          </p>
        </div>
      )}
    </div>
  );
};

export default TradeTimeStatus;
