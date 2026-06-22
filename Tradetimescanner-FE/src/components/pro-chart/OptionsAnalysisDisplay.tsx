import React, { useState } from "react";
import {
    FaArrowUp, FaArrowDown, FaRegClock, FaChartLine, FaCheckCircle,
    FaExclamationTriangle, FaInfoCircle, FaShieldAlt, FaBullseye,
    FaChevronDown, FaChevronUp, FaBolt, FaLayerGroup, FaRedo, FaMicrochip
} from "react-icons/fa";
import { OptionsAnalysisResult } from "../../types/proChart";

interface OptionsAnalysisDisplayProps {
    result: OptionsAnalysisResult;
}

export const OptionsAnalysisDisplay: React.FC<OptionsAnalysisDisplayProps> = ({ result }) => {
    const [isSignalExpanded, setIsSignalExpanded] = useState(false);
    const isCall = (result.tradeDecision.direction || "").toLowerCase().includes("call") ||
        (result.marketSnapshot.currentBias || "").toLowerCase().includes("bullish");

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Disclaimer / No Trade Condition */}
            {result.noTradeCondition?.exists ? (
                <div className="bg-rose-50 rounded-2xl p-6 border border-rose-200 flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                        <FaExclamationTriangle size={24} />
                    </div>
                    <div>
                        <h4 className="text-rose-900 font-black text-lg">NO TRADE SETUP DETECTED</h4>
                        <p className="text-rose-700 font-bold mb-2">{result.noTradeCondition.reason}</p>
                        <div className="space-y-1">
                            <p className="text-xs text-rose-600 font-medium">
                                <span className="font-black">MISSING:</span> {result.noTradeCondition.missingElements}
                            </p>
                            <p className="text-xs text-rose-600 font-medium italic">
                                <span className="font-black uppercase tracking-tight">Wait For:</span> {result.noTradeCondition.whatToWaitFor}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 flex items-start gap-3">
                    <FaExclamationTriangle className="text-yellow-600 mt-1 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-yellow-800">
                           This precision-focused analysis is for educational purposes only.
                        </p>
                    </div>
                </div>
            )}

            {/* Quick Market Snapshot */}
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 border border-white shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Asset & TF</p>
                        <p className="text-lg font-black text-gray-900">{result.marketSnapshot.asset} / {result.marketSnapshot.timeframe}</p>
                    </div>
                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Duration</p>
                        <p className="text-lg font-black text-gray-900">{result.marketSnapshot.tradeDuration}</p>
                    </div>
                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Confidence</p>
                        <p className="text-lg font-black text-gray-900">{result.marketSnapshot.confidenceScore}</p>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Volatility</p>
                        <p className="text-lg font-black text-gray-900">{result.marketSnapshot.volatilityState}</p>
                    </div>
                </div>
            </div>

            {/* Entry Timing & Expiry Alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl space-y-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
                        <FaBolt className="text-yellow-500" /> Precision Entry Timing
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Optimal Entry Zone</p>
                            <p className="text-sm text-gray-700 leading-relaxed font-black">{result.entryTiming.optimalEntryZone}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-50/50">
                                <FaLayerGroup className="text-blue-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Entry Type</p>
                                    <p className="text-xs font-bold text-gray-600">{result.entryTiming.entryType}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-50/50">
                                <FaCheckCircle className="text-emerald-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Candle Confirmation</p>
                                    <p className="text-xs font-bold text-gray-600">{result.entryTiming.exactCandleConfirmationRequired}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl space-y-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
                        <FaRegClock className="text-primary" /> Expiry Alignment
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Suitability</p>
                                <p className="text-sm font-black text-primary">{result.expiryAlignmentAnalysis.durationSuitability}</p>
                            </div>
                            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Window</p>
                                <p className="text-sm font-black text-indigo-600">{result.expiryAlignmentAnalysis.expectedMoveWindow}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 font-medium">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logic</p>
                            <p className="text-sm text-gray-700 leading-relaxed font-bold italic">"{result.expiryAlignmentAnalysis.reasonForDuration}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Micro Structure & Candle Behavior */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-4">
                        <FaMicrochip className="text-indigo-500" /> Micro Structure Analysis
                    </h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <span className="text-[9px] font-black text-gray-400 uppercase block">Formation</span>
                                <span className="text-xs font-black text-gray-900">{result.microMarketStructure.structureFormation}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <span className="text-[9px] font-black text-gray-400 uppercase block">Strength</span>
                                <span className="text-xs font-black text-gray-900">{result.microMarketStructure.structureStrength}</span>
                            </div>
                        </div>
                        <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                            <span className="text-[9px] font-black text-indigo-400 uppercase block mb-1">Market Insight</span>
                            <p className="text-xs font-bold text-gray-700">Currently in {result.microMarketStructure.currentMicroTrend} trend.</p>
                            <p className="text-[10px] text-gray-500 mt-1">{result.microMarketStructure.breakOfStructure}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-4">
                        <FaChartLine className="text-emerald-500" /> Candle Momentum
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Momentum Strength</span>
                            <span className="text-sm font-black text-gray-900">{result.candleBehaviorAnalysis.candleMomentumStrength}</span>
                        </div>
                        <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Pattern Detected</p>
                            <p className="text-xs font-black text-gray-700">{result.candleBehaviorAnalysis.patternDetected || "No specific pattern"}</p>
                            <p className="text-[10px] text-gray-500 font-medium italic mt-1">{result.candleBehaviorAnalysis.rejectionOrContinuationSignal}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decision Explanation */}
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-6">
                    <FaInfoCircle className="text-primary" /> Analyst Explanation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Activity</p>
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">{result.explanation.marketActivityNow}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Direction Reason</p>
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">{result.explanation.directionReasoning}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Duration Logic</p>
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">{result.explanation.durationExpectationReasoning}</p>
                    </div>
                </div>
            </div>

            {/* Interactive Decision Signal */}
            {!result.noTradeCondition?.exists && (
                <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
                    <button
                        onClick={() => setIsSignalExpanded(!isSignalExpanded)}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-4 rounded-2xl ${isCall ? "bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20" : "bg-rose-100 text-rose-600 shadow-lg shadow-rose-500/20"}`}>
                                {isCall ? <FaArrowUp size={24} /> : <FaArrowDown size={24} />}
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                    OPTIONS EXECUTION: {result.tradeDecision.direction}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${result.riskAndTradeQuality.riskLevel === "Low" ? "bg-green-100 text-green-700" :
                                            result.riskAndTradeQuality.riskLevel === "Medium" ? "bg-amber-100 text-amber-700" :
                                                "bg-rose-100 text-rose-700"
                                        }`}>
                                        {result.riskAndTradeQuality.riskLevel} Risk
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-full">
                                        Quality: {result.riskAndTradeQuality.setupQualityScore}/10
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-400">
                            {isSignalExpanded ? <FaChevronUp size={24} /> : <FaChevronDown size={24} />}
                        </div>
                    </button>

                    {isSignalExpanded && (
                        <div className="p-6 pt-0 border-t border-gray-100">
                            <div className={`relative overflow-hidden rounded-[2rem] p-1 shadow-2xl ${isCall ? "bg-gradient-to-br from-emerald-400 to-teal-600" : "bg-gradient-to-br from-rose-400 to-red-600"}`}>
                                <div className="bg-white/95 backdrop-blur-xl rounded-[1.8rem] p-6 md:p-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${isCall ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                                                    {isCall ? <FaArrowUp size={36} /> : <FaArrowDown size={36} />}
                                                </div>
                                                <p className={`font-black text-lg ${isCall ? "text-emerald-600" : "text-rose-600"}`}>
                                                    {isCall ? "CALL" : "PUT"}
                                                </p>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-black text-primary uppercase tracking-widest">{result.marketSnapshot.asset}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{result.marketSnapshot.tradeDuration} EXPIRY</span>
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">
                                                    PRE-SET <span className={isCall ? "text-emerald-500" : "text-rose-500"}>SIGNAL</span>
                                                </h2>
                                                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                                    <FaCheckCircle size={12} />
                                                    {result.tradeDecision.setupStrength} SETUP
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 px-8 py-6 rounded-[2rem] border border-gray-100 shadow-inner flex flex-col justify-center">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Execute at Zone</p>
                                            <p className="text-3xl md:text-4xl font-black text-gray-900 text-center tracking-tight">{result.entryTiming.optimalEntryZone}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                <FaShieldAlt className="text-blue-500" /> Reaction Zones
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Support</p>
                                                    <p className="text-sm font-black text-gray-900">{result.keyReactionZones.immediateSupport}</p>
                                                </div>
                                                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Resistance</p>
                                                    <p className="text-sm font-black text-gray-900">{result.keyReactionZones.immediateResistance}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                <FaBolt className="text-yellow-500" /> Momentum Flow
                                            </h4>
                                            <div className="bg-yellow-50/30 p-4 rounded-2xl border border-yellow-100/50">
                                                <div className="flex justify-between mb-3 border-b border-yellow-100 pb-2">
                                                    <span className="text-[10px] font-black text-yellow-600 uppercase">Direction</span>
                                                    <span className="text-xs font-black text-gray-900">{result.momentumFlow.momentumDirection}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase">Risk</p>
                                                        <p className="text-[10px] font-bold text-rose-600 uppercase">{result.momentumFlow.fakeMoveRisk}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase">Trend</p>
                                                        <p className="text-[10px] font-bold text-gray-900 uppercase">{result.momentumFlow.accelerationOrWeakening}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                        <FaInfoCircle className="text-primary shrink-0" />
                                        <p className="text-xs font-bold text-gray-600 leading-relaxed italic">
                                            "{result.timeframeConsistencyCheck.reason}" - Consideration: {result.timeframeConsistencyCheck.adjustmentSuggestion}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
