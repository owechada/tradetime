import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { onGetSavedStrategies } from "../../services/user";
import { toast } from "react-toastify";
import {
  FaChartLine,
  FaArrowLeft,
} from "react-icons/fa";
import Spinner from "../../components/generic/Spinner";
import StrategyCard from "../../components/generic/StrategyCard";
import { ResponsiveContainer } from "../../components/responsive/ResponsiveContainer";
import { ResponsiveGrid } from "../../components/responsive/ResponsiveGrid";
import { LazyWrapper } from "../../components/responsive/LazyWrapper";
import { useResponsive } from "../../hooks/useResponsive";
import { usePerformanceOptimization } from "../../hooks/usePerformanceOptimization";

interface SavedStrategy {
  id: number;
  userid: string;
  strategyName: string;
  recommendedIndicators: Array<{
    name: string;
    explanation: string;
  }>;
  signal_annotation?: string; // Base64 image string
  recommendedtradetime: string;
  recommendedtimeframe: string;
  strategyexplanation: string;
  createdAt: string;
  updatedAt: string;
}

const AllSavedStrategies: React.FC = () => {
  const [strategies, setStrategies] = useState<SavedStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const { authuser } = useStateGetter();
  const { isMobile, isTablet } = useResponsive();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedStrategies();
  }, []);

  const fetchSavedStrategies = async () => {
    if (!authuser?.id) {
      toast.error("User not authenticated");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await onGetSavedStrategies(authuser.id);
      if (response.success) {
        setStrategies(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch strategies");
      }
    } catch (error: any) {
      console.error("Error fetching strategies:", error);
      toast.error(error || "Failed to fetch strategies");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewStrategy = (strategy: SavedStrategy) => {
    navigate(`/strategy/${strategy.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
          <Spinner loading={true} />
          <p className={`text-gray-600 mt-4 text-center ${isMobile ? 'text-sm' : 'text-base'}`}>
            Loading your strategies...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 md:py-12 overflow-x-hidden">
      <ResponsiveContainer
        maxWidth="xl"
        padding={isMobile ? "sm" : "lg"}
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-blue-500/10 p-6 md:p-10">
          {/* Responsive Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/strategy")}
                className="p-2 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all text-primary"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaChartLine className="text-primary text-xs" />
                  <span className="text-primary font-black uppercase tracking-widest text-[10px]">Strategy Vault</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Saved <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Strategies</span>
                </h1>
                <p className={`text-gray-400 font-medium mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {strategies.length} {strategies.length === 1 ? 'strategy' : 'strategies'} saved
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/strategy")}
              className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <FaChartLine size={16} />
              Create Strategy
            </button>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Responsive Strategies Display */}
          {strategies.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-primary text-2xl" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">
                No saved strategies
              </h3>
              <p className="text-gray-400 font-medium mb-6 max-w-sm mx-auto">
                Create your first strategy to get started
              </p>
              <button
                onClick={() => navigate("/strategy")}
                className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Create Strategy
              </button>
            </div>
          ) : (
            <div>
              {/* Grid Layout for larger screens, List for mobile */}
              {isMobile ? (
                <div className="space-y-4">
                  {strategies.map((strategy, index) => (
                    <LazyWrapper
                      key={strategy.id}
                      threshold={0.2}
                      rootMargin="50px"
                      minHeight="200px"
                      className="w-full"
                    >
                      <StrategyCard
                        strategy={strategy}
                        onViewStrategy={handleViewStrategy}
                        formatDate={formatDate}
                      />
                    </LazyWrapper>
                  ))}
                </div>
              ) : (
                <ResponsiveGrid
                  columns={{
                    mobile: 1,
                    tablet: 1,
                    desktop: 2
                  }}
                  gap={isTablet ? "md" : "lg"}
                >
                  {strategies.map((strategy, index) => (
                    <LazyWrapper
                      key={strategy.id}
                      threshold={0.1}
                      rootMargin="100px"
                      minHeight="250px"
                      className="w-full"
                    >
                      <StrategyCard
                        strategy={strategy}
                        onViewStrategy={handleViewStrategy}
                        formatDate={formatDate}
                      />
                    </LazyWrapper>
                  ))}
                </ResponsiveGrid>
              )}
            </div>
          )}
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default AllSavedStrategies;
