import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { onGetStrategyById } from "../../services/user";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import Spinner from "../../components/generic/Spinner";
import StrategyDetails from "../../components/generic/StrategyDetails";

interface SavedStrategy {
  id: number;
  userid: string;
  strategyName: string;
  recommendedIndicators: Array<{
    name: string;
    explanation?: string;
    settings?: string;
    role?: string;
  }>;
  recommendedPairs?: Array<{
    pair: string;
    rationale?: string;
  }>;
  strategyExplanation?: string;
  tradePlan?: {
    timeFrame?: string;
    [key: string]: any;
  };
  signal_annotation?: string; // Base64 image string
  recommendedtradetime: string;
  recommendedtimeframe: string;
  strategyexplanation: string;
  selectedCategory?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

const StrategyDetail: React.FC = () => {
  const [strategy, setStrategy] = useState<SavedStrategy | null>(null);
  const [loading, setLoading] = useState(true);
  const { authuser } = useStateGetter();
  const { setLoading: setGlobalLoading } = useStateSetter();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchStrategy(id);
    } else {
      toast.error("Strategy ID not provided");
      navigate("/saved-strategies");
    }
  }, [id]);

  const fetchStrategy = async (strategyId: string) => {
    setLoading(true);
    try {
      const response = await onGetStrategyById(strategyId);
      if (response.success) {
        setStrategy(response.data);
      } else {
        toast.error(response.message || "Failed to fetch strategy");
        navigate("/saved-strategies");
      }
    } catch (error: any) {
      console.error("Error fetching strategy:", error);
      toast.error(error || "Failed to fetch strategy");
      navigate("/saved-strategies");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner loading={true} />
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Strategy not found
          </h2>
          <p className="text-gray-600 mb-4">
            The strategy you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate("/saved-strategies")}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Strategies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/saved-strategies")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              <span className="text-sm font-medium">Back to Strategies</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {strategy.strategyName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>Created: {formatDate(strategy.createdAt)}</span>
                  </div>
                  {strategy.updatedAt !== strategy.createdAt && (
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-green-500" />
                      <span>Updated: {formatDate(strategy.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <StrategyDetails
            strategyData={strategy}
            selectedCategory={strategy?.selectedCategory || strategy?.category}
          />
        </div>
      </div>
    </div>
  );
};

export default StrategyDetail;
