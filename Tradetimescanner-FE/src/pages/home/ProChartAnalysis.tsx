import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaMagic, FaHistory, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ChartUploader } from "../../components/pro-chart/ChartUploader";
import { AnalysisForm } from "../../components/pro-chart/AnalysisForm";
import { AnalysisResultDisplay } from "../../components/pro-chart/AnalysisResultDisplay";
import { AnalysisHistoryList } from "../../components/pro-chart/AnalysisHistoryList";
import { analyzeChart, getAnalysisHistory } from "../../services/proChart";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { ResponsiveContainer } from "../../components/responsive/ResponsiveContainer";
import usePremiumHook from "../../hooks/usePremiumHook";
import PackageSelectionmodal from "../../components/generic/PackageSelectionmodal";
import { CiCircleAlert } from "react-icons/ci";
import { ProChartAnalysisResponse } from "../../types/proChart";

const ProChartAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const { authuser } = useStateGetter();
    const { setLoading } = useStateSetter();
    const { hasaccess, dailycredit, setdailycredit } = usePremiumHook();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [market, setMarket] = useState("");
    const [marketType, setMarketType] = useState("Gold");
    const [timeframe, setTimeframe] = useState("1h");
    const [tradeMode, setTradeMode] = useState("Intraday");
    const [analysisType, setAnalysisType] = useState("Regular");
    const [tradeDuration, setTradeDuration] = useState("5m");
    const [analysisResult, setAnalysisResult] = useState<ProChartAnalysisResponse | null>(null);
    const [history, setHistory] = useState<Array<{ id: string; market: string; marketType: string; timeframe: string; tradeMode: string; analysisResult: ProChartAnalysisResponse; createdAt: string }>>([]);
    const [view, setView] = useState<"upload" | "result" | "history">("upload");
    const [showPack, setShowPack] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (analysisType === "Option") {
            const validOptions = ["1m", "5m", "15m"];
            if (!validOptions.includes(timeframe)) {
                setTimeframe("5m");
            }
            setMarketType("Forex");
        }
    }, [analysisType]);

    const fetchHistory = async () => {
        if (!authuser?.id) return;
        try {
            const data = await getAnalysisHistory(authuser.id);
            setHistory(data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    const handleAnalyze = async () => {
        // Premium-only feature: Show subscription modal for free users
        if (!hasaccess) {
            setShowPack(true);
            toast.info("Pro Chart Analysis is a premium feature. Please upgrade to continue.");
            return;
        }

        if (!selectedFile) {
            toast.error("Please upload a chart first");
            return;
        }

        if (!market.trim()) {
            toast.error("Please enter the asset name (e.g. EURUSD)");
            return;
        }

        const formData = new FormData();
        formData.append("chart", selectedFile);
        formData.append("market", market);
        formData.append("marketType", marketType);
        formData.append("timeframe", timeframe);

        // Use binary option format if analysisType is "Option"
        const finalTradeMode = analysisType === "Option"
            ? `Options (Duration: ${tradeDuration})`
            : tradeMode;
        formData.append("tradeMode", finalTradeMode);
        formData.append("tradeDuration", tradeDuration);
        formData.append("userId", authuser.id);

        setLoading(true);
        try {
            const response = await analyzeChart(formData);
            setAnalysisResult(response.data.analysisResult);
            setView("result");
            toast.success("Analysis completed!");

            fetchHistory(); // Refresh history
        } catch (err: any) {
            toast.error(err || "Failed to analyze chart");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectHistoryItem = (item: any) => {
        setAnalysisResult(item.analysisResult);
        setView("result");
    };

    const resetAnalysis = () => {
        setSelectedFile(null);
        setAnalysisResult(null);
        setView("upload");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-12">
            {showPack && (
                <PackageSelectionmodal
                    show={(state: boolean) => setShowPack(state)}
                />
            )}

            <ResponsiveContainer maxWidth="full" padding="md" className="py-6 sm:py-8">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => view === "upload" ? navigate("/dashboard") : resetAnalysis()}
                        className="p-2 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all text-primary"
                    >
                        <IoIosArrowRoundBack size={32} />
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setView("history")}
                            className={`p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm ${view === "history" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-gray-600 shadow-md hover:shadow-lg"
                                }`}
                        >
                            <FaHistory /> {view !== "history" && "History"}
                        </button>
                    </div>
                </div>

                {/* Page Title Section */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                        <FaChartLine className="text-primary text-xs" />
                        <span className="text-primary font-black uppercase tracking-widest text-[10px]">AI-Powered Technical Analysis</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Pro <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Chart Analysis</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                        Upload any market chart and get professional, institutional-grade AI analysis including key levels, structure, and trade recommendations.
                    </p>

                    {!hasaccess && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-amber-600 font-bold bg-amber-50 px-6 py-3 rounded-2xl border border-amber-200">
                            <CiCircleAlert size={20} />
                            <span>Premium Feature - Upgrade to unlock Pro Chart Analysis</span>
                        </div>
                    )}
                </div>

                {/* Main Content Areas */}
                <div className="max-w-5xl mx-auto">
                    {view === "upload" && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                            <div className="lg:col-span-12 space-y-8">
                                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 border border-white shadow-2xl shadow-blue-500/5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                                    1. Upload Chart
                                                </h3>
                                                <p className="text-sm text-gray-400 font-medium">Screenshot or direct capture</p>
                                            </div>
                                            <ChartUploader selectedFile={selectedFile} onFileSelect={setSelectedFile} />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                                    2. Configure Analysis
                                                </h3>
                                                <p className="text-sm text-gray-400 font-medium">Define market context</p>
                                            </div>
                                            <AnalysisForm
                                                market={market}
                                                setMarket={setMarket}
                                                marketType={marketType}
                                                setMarketType={setMarketType}
                                                timeframe={timeframe}
                                                setTimeframe={setTimeframe}
                                                tradeMode={tradeMode}
                                                setTradeMode={setTradeMode}
                                                analysisType={analysisType}
                                                setAnalysisType={setAnalysisType}
                                                tradeDuration={tradeDuration}
                                                setTradeDuration={setTradeDuration}
                                            />

                                            <button

                                                onClick={handleAnalyze}
                                                disabled={!selectedFile}
                                                // disabled={true}
                                                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all ${selectedFile
                                                    ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    }`}
                                            >
                                                <FaMagic /> {!hasaccess ? "Upgrade to Analyze" : "Start AI Analysis"}
                                            </button>

                                            {!hasaccess && (
                                                <p className="text-center text-xs font-bold text-amber-600 uppercase tracking-widest mt-2">
                                                    Premium feature - Unlimited AI-powered chart analysis
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === "result" && analysisResult && (
                        <AnalysisResultDisplay result={analysisResult} />
                    )}

                    {view === "history" && (
                        <div className="animate-fadeIn">
                            <AnalysisHistoryList history={history} onSelect={handleSelectHistoryItem} />
                        </div>
                    )}
                </div>
            </ResponsiveContainer>

        </div>
    );
};

export default ProChartAnalysis;
