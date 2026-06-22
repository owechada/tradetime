import React, { useState } from "react";
import {
    FaArrowUp, FaArrowDown, FaLevelUpAlt, FaLevelDownAlt,
    FaChartBar, FaCheckCircle, FaExclamationTriangle, FaInfoCircle,
    FaShieldAlt, FaBullseye, FaRegClock, FaWaveSquare, FaGem, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { ProChartAnalysisResponse, StandardAnalysisResult } from "../../types/proChart";
import { OptionsAnalysisDisplay } from "./OptionsAnalysisDisplay";

interface AnalysisResultDisplayProps {
    result: ProChartAnalysisResponse;
}

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result: initialResult }) => {
    const [isSignalExpanded, setIsSignalExpanded] = useState(false);

    let result = initialResult;
    if (typeof result === 'string') {
        try {
            result = JSON.parse(result);
        } catch (e) {
            console.error("Failed to parse analysis result", e);
        }
    }

    // Type Guard to check if it's Options Analysis
    const isOptionsAnalysis = (res: any): res is import("../../types/proChart").OptionsAnalysisResult => {
        return res && typeof res === 'object' && (res.marketSnapshot !== undefined || res.tradeDecision !== undefined);
    };

    if (isOptionsAnalysis(result)) {
        return <OptionsAnalysisDisplay result={result} />;
    }

    // Standard Analysis Rendering (Existing Logic)
    const stdResult = result as StandardAnalysisResult;

    // Check for "No Setup" condition
    if (stdResult?.tradeSetup?.setupStatus === "NO HIGH-PROBABILITY SETUP DETECTED") {
        return (
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-12 border border-white shadow-xl text-center space-y-6 animate-fadeIn">
                <div className="mx-auto w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">
                    <FaExclamationTriangle size={48} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        NO HIGH-PROBABILITY SETUP
                    </h2>
                    <p className="text-gray-500 font-medium max-w-md mx-auto">
                        The AI has not detected a setup that meets our strict institutional-grade requirements for regular trading. Please wait for a better opportunity.
                    </p>
                </div>
                {stdResult?.marketSummary?.marketBias && (
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 inline-block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Market Context</p>
                        <p className="text-sm font-bold text-gray-700">{stdResult.marketSummary.marketBias}</p>
                    </div>
                )}
            </div>
        );
    }

    const isBuy = (stdResult?.tradeSetup?.tradeDirection || "").toLowerCase().includes("buy") ||
        (stdResult?.tradeSetup?.tradeDirection || "").toLowerCase().includes("call") ||
        (stdResult?.tradeSetup?.tradeDirection || "").toLowerCase().includes("bullish");

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Dynamic Disclaimer at Top */}
            <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 flex items-start gap-3">
                <FaExclamationTriangle className="text-yellow-600 mt-1 shrink-0" />
                <div>
                    <p className="text-sm font-bold text-yellow-800">
                        {stdResult?.marketSummary?.disclaimer || "This analysis is for educational purposes only. Trade and analyze responsibly."}
                    </p>
                </div>
            </div>

            {/* AI Reasoning & Confirmation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl space-y-6">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
                            <FaWaveSquare className="text-primary" /> Chart Reasoning
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Analysis Narrative</p>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{stdResult?.chartReasoning?.narrative || "No narrative available"}</p>
                            </div>
                            <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-50/50">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Visual Evidence</p>
                                <p className="text-sm text-gray-600 font-bold">{stdResult?.chartReasoning?.visualEvidence || "No evidence noted"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl space-y-6">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
                            <FaGem className="text-amber-500" /> Candle Confirmation
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Confirmation Logic</p>
                                <p className="text-sm text-gray-700 leading-relaxed font-bold">{stdResult?.candleConfirmation?.logic || "Confirmation logic not provided"}</p>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl">
                                <FaCheckCircle className="text-emerald-500 shrink-0" />
                                <p className="text-xs font-bold text-gray-600">{stdResult?.candleConfirmation?.requirement || "Requirement unspecified"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Invalidation & Performance metrics */}
                <div className="space-y-6">
                    {(stdResult?.invalidationLogic || stdResult?.tradeLevels?.invalidationLevel) && (
                        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-4">
                                <FaExclamationTriangle className="text-rose-500" /> Invalidation Logic
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                                    {stdResult?.invalidationLogic?.condition ? (
                                        <>
                                            <p className="text-sm font-black text-rose-600 mb-1">{stdResult.invalidationLogic.condition}</p>
                                            <p className="text-xs font-medium text-gray-500 italic">{stdResult.invalidationLogic.reason || "Reason not provided"}</p>
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Invalidation Zone</p>
                                            <p className="text-sm font-bold text-rose-700">{stdResult?.tradeLevels?.invalidationLevel || "N/A"}</p>
                                            <p className="text-[10px] text-gray-400 italic font-medium">Exit trade if price hits this level/area</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl h-full">
                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-4">
                            <FaBullseye className="text-purple-500" /> Advanced Metrics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">SETUP QUALITY</span>
                                <span className="text-sm font-black text-gray-900">{stdResult?.advancedMetrics?.setupQualityScore || stdResult?.marketSummary?.setupQuality || "Strong Setup Quality"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(stdResult?.advancedMetrics?.confidenceBreakdown || {
                                    structure: "✅",
                                    trendAlignment: "✅",
                                    volumeVolatility: "✅",
                                    sessionTiming: "⚠️"
                                }).map(([key, value]) => {
                                    const isEmoji = value === "✅" || value === "⚠️";
                                    return (
                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest max-w-[80px]">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            {isEmoji ? (
                                                <span className="text-xl">{value}</span>
                                            ) : (
                                                <div className="bg-emerald-500 p-1 rounded-lg">
                                                    <FaCheckCircle className="text-white text-[10px]" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt Scenario & Price Levels */}
                <div className="space-y-6">
                    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl">
                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-4">
                            <FaLevelDownAlt className="text-blue-500" /> Alternative Scenario
                        </h3>
                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                            <p className="text-sm font-bold text-gray-700 mb-2">{stdResult?.alternativeScenario?.scenario || "No alternative scenario provided"}</p>
                            <div className="inline-block px-3 py-1 bg-white rounded-lg border border-blue-200 text-xs font-black text-blue-600 uppercase tracking-widest">
                                Trigger: {stdResult?.alternativeScenario?.triggerLevel || "N/A"}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl">
                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-6">
                            <FaShieldAlt className="text-blue-500" /> Key Price Levels
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3">Resistance</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-rose-50/50 p-2 rounded-xl text-center border border-rose-100">
                                        <p className="text-[9px] font-black text-rose-300">R1</p>
                                        <p className="text-xs font-black text-rose-600">{stdResult?.keyPriceLevels?.resistance?.r1 || "N/A"}</p>
                                    </div>
                                    <div className="bg-rose-50/50 p-2 rounded-xl text-center border border-rose-100">
                                        <p className="text-[9px] font-black text-rose-300">R2</p>
                                        <p className="text-xs font-black text-rose-600">{stdResult?.keyPriceLevels?.resistance?.r2 || "N/A"}</p>
                                    </div>
                                    <div className="bg-rose-50/50 p-2 rounded-xl text-center border border-rose-100">
                                        <p className="text-[9px] font-black text-rose-300">R3</p>
                                        <p className="text-xs font-black text-rose-600">{stdResult?.keyPriceLevels?.resistance?.r3 || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Support</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-emerald-50/50 p-2 rounded-xl text-center border border-emerald-100">
                                        <p className="text-[9px] font-black text-emerald-300">S1</p>
                                        <p className="text-xs font-black text-emerald-600">{stdResult?.keyPriceLevels?.support?.s1 || "N/A"}</p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-2 rounded-xl text-center border border-emerald-100">
                                        <p className="text-[9px] font-black text-emerald-300">S2</p>
                                        <p className="text-xs font-black text-emerald-600">{stdResult?.keyPriceLevels?.support?.s2 || "N/A"}</p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-2 rounded-xl text-center border border-emerald-100">
                                        <p className="text-[9px] font-black text-emerald-300">S3</p>
                                        <p className="text-xs font-black text-emerald-600">{stdResult?.keyPriceLevels?.support?.s3 || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Collapsible Signal Details Section */}
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
                <button
                    onClick={() => setIsSignalExpanded(!isSignalExpanded)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${isBuy ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                            {isBuy ? <FaArrowUp size={24} /> : <FaArrowDown size={24} />}
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-gray-900">Signal Details</h3>
                            <p className="text-sm text-gray-500 font-medium">Click to {isSignalExpanded ? 'hide' : 'view'} entry zones and targets</p>
                        </div>
                    </div>
                    <div className="text-gray-400">
                        {isSignalExpanded ? <FaChevronUp size={24} /> : <FaChevronDown size={24} />}
                    </div>
                </button>

                {isSignalExpanded && (
                    <div className="p-6 pt-0 border-t border-gray-100">
                        <div className={`relative overflow-hidden rounded-[2rem] p-1 shadow-xl ${isBuy ? "bg-gradient-to-br from-emerald-400 to-teal-600" : "bg-gradient-to-br from-rose-400 to-red-600"}`}>
                            <div className="bg-white/95 backdrop-blur-xl rounded-[1.8rem] p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-3xl ${isBuy ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                                            {isBuy ? <FaArrowUp size={32} /> : <FaArrowDown size={32} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-black text-primary uppercase tracking-widest">{stdResult?.marketSummary?.asset || "Asset"}</span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stdResult?.marketSummary?.timeframe || "TF"}</span>
                                            </div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                                {(stdResult?.tradeSetup?.tradeDirection || "WAITING").toUpperCase()}
                                            </h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${(stdResult?.marketSummary?.riskRating || "").toLowerCase() === "low" ? "bg-green-100 text-green-700" :
                                                    (stdResult?.marketSummary?.riskRating || "").toLowerCase() === "medium" ? "bg-amber-100 text-amber-700" :
                                                        "bg-rose-100 text-rose-700"
                                                    }`}>
                                                    {stdResult?.marketSummary?.riskRating || "Unknown"} Risk
                                                </span>
                                                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    <FaCheckCircle size={10} />
                                                    {stdResult?.marketSummary?.setupQuality || "Analyzing"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Suggested Entry</p>
                                            <p className="text-2xl font-black text-gray-900">{stdResult?.tradeLevels?.suggestedEntryZone || "N/A"}</p>
                                        </div>
                                        <div className="bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100 min-w-[200px]">
                                            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Invalidation Level</p>
                                            <p className="text-lg font-black text-rose-600 leading-tight">
                                                {stdResult?.tradeLevels?.invalidationLevel || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* TP Targets */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 px-6 md:px-8">
                                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaBullseye className="text-emerald-500" />
                                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">TP Target 1</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">{stdResult?.tradeLevels?.targetZones?.targetZone1 || "N/A"}</p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaBullseye className="text-emerald-500" />
                                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">TP Target 2</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">{stdResult?.tradeLevels?.targetZones?.targetZone2 || "N/A"}</p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaBullseye className="text-emerald-500" />
                                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">TP Target 3</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">{stdResult?.tradeLevels?.targetZones?.targetZone3 || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Details Bar */}
                                <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-100 px-6 md:px-8 pb-4">
                                    <div className="flex items-center gap-2">
                                        <FaRegClock className="text-blue-500" />
                                        <span className="text-sm font-bold text-gray-700">{stdResult?.tradeSetup?.tradeStyle || "Any"} Style</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaChartBar className="text-purple-500" />
                                        <span className="text-sm font-bold text-gray-700 capitalize">Risk {stdResult?.tradeLevels?.riskPercentage || "variable"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaGem className="text-amber-500" />
                                        <span className={`text-sm font-bold ${
                                            (stdResult?.advancedMetrics?.tradeExpectancyType || "").toLowerCase().includes("positive") ? "text-emerald-600" :
                                            (stdResult?.advancedMetrics?.tradeExpectancyType || "").toLowerCase().includes("caution") ? "text-amber-600" :
                                            "text-gray-700"
                                        }`}>
                                            Expectancy: {stdResult?.advancedMetrics?.tradeExpectancyType || "Standard"}
                                        </span>
                                    </div>
                                    {stdResult?.tradeLevels?.partialCloseRecommendation && (
                                        <div className="flex items-center gap-2">
                                            <FaInfoCircle className="text-gray-400" />
                                            <span className="text-sm font-bold text-gray-700">Close: {stdResult?.tradeLevels?.partialCloseRecommendation}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Management Guidance */}
                                {stdResult?.tradeLevels?.managementGuidance && (
                                    <div className="mt-4 m-6 md:m-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-3">
                                        <FaInfoCircle className="text-blue-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Management Guidance</p>
                                            <p className="text-sm font-medium text-gray-700 leading-relaxed">{stdResult?.tradeLevels?.managementGuidance}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
