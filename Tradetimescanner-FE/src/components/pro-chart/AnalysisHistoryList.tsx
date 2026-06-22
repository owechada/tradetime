import React from "react";
import { FaHistory, FaChevronRight, FaRegCalendarAlt, FaChartLine } from "react-icons/fa";
import { ProChartAnalysisResponse } from "../../types/proChart";

interface HistoryItem {
    id: string;
    market: string;
    marketType: string;
    tradeMode: string;
    timeframe: string;
    createdAt: string;
    analysisResult: ProChartAnalysisResponse;
}

interface AnalysisHistoryListProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

export const AnalysisHistoryList: React.FC<AnalysisHistoryListProps> = ({ history, onSelect }) => {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                    <FaHistory className="text-gray-300 text-4xl" />
                </div>
                <p className="text-gray-500 font-medium">No analysis history yet</p>
                <p className="text-xs text-gray-400 mt-1">Your past reports will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 ml-1">
                <FaHistory className="text-primary" />
                <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">Past Analyses</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => {
                    const isOptions = (res: any): res is import("../../types/proChart").OptionsAnalysisResult => {
                        return res && res.marketSnapshot !== undefined;
                    };

                    let res = item.analysisResult;
                    if (typeof res === 'string') {
                        try {
                            res = JSON.parse(res);
                        } catch (e) {
                            console.error("Failed to parse analysisResult", e);
                        }
                    }

                    let asset = item.market || item.marketType;
                    let direction = "Analyzed";
                    let isBuy = false;

                    if (isOptions(res)) {
                        asset = res.marketSnapshot?.asset || asset;
                        direction = res.tradeDecision?.direction || direction;
                        isBuy = direction.toLowerCase().includes("call") || (res.marketSnapshot?.currentBias || "").toLowerCase().includes("bullish");
                    } else if (res && typeof res === 'object' && 'marketSummary' in res) {
                        asset = (res as any).marketSummary?.asset || asset;
                        direction = (res as any).tradeSetup?.tradeDirection || direction;
                        isBuy = direction.toLowerCase().includes("buy") || ((res as any).marketSummary?.marketBias || "").toLowerCase().includes("bullish");
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className="group flex flex-col p-5 bg-white border border-gray-100 rounded-3xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 text-gray-100 group-hover:text-primary/10 transition-colors">
                                <FaChartLine size={60} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg font-black text-gray-900 uppercase truncate pr-8">{asset}</h4>
                                    <div className="flex gap-1">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">
                                            {item.timeframe}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${isBuy ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                        }`}>
                                        {direction || "Analyzed"}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{item.marketType}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-medium mt-auto">
                                    <FaRegCalendarAlt />
                                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-600">View Detailed Report</span>
                                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                                    <FaChevronRight size={10} />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
