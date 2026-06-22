import React from "react";
import { FaGlobe, FaClock, FaKeyboard, FaExchangeAlt } from "react-icons/fa";

interface AnalysisFormProps {
    market: string;
    setMarket: (val: string) => void;
    marketType: string;
    setMarketType: (val: string) => void;
    timeframe: string;
    setTimeframe: (val: string) => void;
    tradeMode: string;
    setTradeMode: (val: string) => void;
    analysisType: string;
    setAnalysisType: (val: string) => void;
    tradeDuration: string;
    setTradeDuration: (val: string) => void;
}

const MARKET_TYPES = ["Forex", "Gold", "Crypto", "Indices", "Stocks", "Commodities"];
const REGULAR_TIMEFRAMES = ["5m", "15m", "30m", "1h", "4h", "Daily", "Weekly"];
const OPTION_TIMEFRAMES = ["1m", "5m", "15m"];
const TRADE_MODES = ["Scalp", "Intraday", "Swing"];

const DURATION_TYPES = ["3m", "5m", "15m", "30m"];

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
    market,
    setMarket,
    marketType,
    setMarketType,
    timeframe,
    setTimeframe,
    tradeMode,
    setTradeMode,
    analysisType,
    setAnalysisType,
    tradeDuration,
    setTradeDuration,
}) => {
    return (
        <div className="space-y-6 w-full pb-4">
            <div className="flex bg-gray-100 p-1 rounded-xl">
                {["Regular", "Option"].map((type) => (
                    <button
                        key={type}
                        onClick={(e) => {
                            e.preventDefault();
                            setAnalysisType(type);
                        }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${analysisType === type
                            ? "bg-white text-primary shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                    <FaKeyboard className="text-primary" /> Asset Name (e.g. EURUSD, XAUUSD)
                </label>
                <input
                    type="text"
                    value={market}
                    onChange={(e) => setMarket(e.target.value.toUpperCase())}
                    placeholder="Enter asset name..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary focus:outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                    <FaGlobe className="text-primary" /> Market Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MARKET_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={(e) => {
                                e.preventDefault();
                                setMarketType(type);
                            }}
                            className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${marketType === type
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "bg-white text-gray-600 border-gray-100 hover:border-primary/30"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {analysisType === "Option" ? (
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                        <FaExchangeAlt className="text-indigo-500" /> Trade Duration
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {DURATION_TYPES.map((dur) => (
                            <button
                                key={dur}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setTradeDuration(dur);
                                }}
                                className={`px-2 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${tradeDuration === dur
                                    ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                                    : "bg-white text-gray-600 border-gray-100 hover:border-indigo-500/30"
                                    }`}
                            >
                                {dur}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                        <FaExchangeAlt className="text-indigo-500" /> Trading Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {TRADE_MODES.map((mode) => (
                            <button
                                key={mode}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setTradeMode(mode);
                                }}
                                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${tradeMode === mode
                                    ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                                    : "bg-white text-gray-600 border-gray-100 hover:border-indigo-500/30"
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                    <FaClock className="text-blue-500" /> Timeframe
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {(analysisType === "Option" ? OPTION_TIMEFRAMES : REGULAR_TIMEFRAMES).map((tf) => (
                        <button
                            key={tf}
                            onClick={(e) => {
                                e.preventDefault();
                                setTimeframe(tf);
                            }}
                            className={`px-2 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${timeframe === tf
                                ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20"
                                : "bg-white text-gray-600 border-gray-100 hover:border-blue-500/30"
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
