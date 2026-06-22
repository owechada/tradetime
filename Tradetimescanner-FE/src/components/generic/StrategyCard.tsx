import React from "react";
import { FaChartLine, FaClock } from "react-icons/fa";
import { useResponsive } from "../../hooks/useResponsive";
import { useResponsivePolish } from "../../hooks/useResponsivePolish";
import "../../styles/responsive-polish.css";

interface StrategyCardProps {
  strategy: {
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
  };
  onViewStrategy: (strategy: any) => void;
  formatDate: (dateString: string) => string;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onViewStrategy,
  formatDate,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const {
    addTouchFeedback,
    touchDevice,
    microInteractionsEnabled,
    getResponsiveSpacing,
  } = useResponsivePolish();

  // Parse recommendedIndicators if it's a string
  const parseIndicators = () => {
    try {
      if (typeof strategy.recommendedIndicators === 'string') {
        return JSON.parse(strategy.recommendedIndicators);
      }
      return strategy.recommendedIndicators || [];
    } catch (error) {
      console.error('Error parsing recommendedIndicators:', error);
      return [];
    }
  };

  const indicators = parseIndicators();

  // Handle card click with polish effects
  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (touchDevice) {
      addTouchFeedback(event.currentTarget);
    }
    onViewStrategy(strategy);
  };

  // Responsive configuration with polish
  const getResponsiveClasses = () => {
    const baseClasses = [
      "bg-white",
      "rounded-responsive-lg",
      "border",
      "border-gray-200",
      "cursor-pointer",
      "card-micro",
      "transition-responsive",
      touchDevice ? "touch-feedback" : "hover-lift",
    ];
    
    if (isMobile) {
      baseClasses.push("hover:shadow-sm");
    } else if (isTablet) {
      baseClasses.push("hover:shadow-md");
    } else {
      baseClasses.push("hover:shadow-lg");
    }
    
    return baseClasses.join(" ");
  };

  const getPaddingClasses = () => {
    if (isMobile) return "padding-responsive-md";
    if (isTablet) return "padding-responsive-lg";
    return "padding-responsive-xl";
  };

  const getTitleClasses = () => {
    const baseClasses = "font-semibold text-gray-900 mb-1";
    if (isMobile) return `${baseClasses} text-responsive-base leading-tight`;
    if (isTablet) return `${baseClasses} text-responsive-lg`;
    return `${baseClasses} text-responsive-lg`;
  };

  const getDescriptionLines = () => {
    if (isMobile) return 2;
    if (isTablet) return 2;
    return 3;
  };

  const getIndicatorDisplayCount = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  return (
    <div
      className={getResponsiveClasses()}
      onClick={handleCardClick}
    >
      <div className={getPaddingClasses()}>
        {/* Strategy Header - Responsive Layout */}
        <div className={`flex ${isMobile ? 'flex-col gap-responsive-sm' : 'items-start justify-between'} space-responsive-md`}>
          <div className="flex-1">
            <h3 className={getTitleClasses()}>
              {strategy.strategyName}
            </h3>
            <p className={`text-gray-500 ${isMobile ? 'text-responsive-xs' : 'text-responsive-sm'}`}>
              Created {formatDate(strategy.createdAt)}
            </p>
          </div>
          <div className={`flex items-center gap-responsive-xs text-gray-500 ${isMobile ? 'text-responsive-xs self-start' : 'text-responsive-sm'}`}>
            <FaChartLine className="text-xs" />
            <span>{indicators?.length || 0} indicators</span>
          </div>
        </div>

        {/* Strategy Summary - Responsive Typography */}
        <div className="space-responsive-md">
          <p 
            className={`text-gray-700 overflow-hidden leading-responsive-normal ${isMobile ? 'text-responsive-xs' : 'text-responsive-sm'}`} 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: getDescriptionLines(),
              WebkitBoxOrient: 'vertical',
            }}
          >
            {strategy.strategyexplanation}
          </p>
        </div>

        {/* Quick Info - Responsive Layout */}
        <div className={`flex ${isMobile ? 'flex-col gap-responsive-sm' : 'items-center gap-responsive-lg'} ${isMobile ? 'text-responsive-xs' : 'text-responsive-sm'}`}>
          <div className="flex items-center gap-responsive-xs text-gray-600">
            <FaClock className="text-xs" />
            <span className={isMobile ? 'truncate' : ''}>{strategy.recommendedtradetime}</span>
          </div>
          <div className="flex items-center gap-responsive-xs text-gray-600">
            <FaChartLine className="text-xs" />
            <span className={isMobile ? 'truncate' : ''}>{strategy.recommendedtimeframe}</span>
          </div>
        </div>

        {/* Indicators Preview - Responsive Display */}
        {indicators && indicators.length > 0 && (
          <div className={`${isMobile ? 'space-responsive-sm padding-responsive-sm' : 'space-responsive-md padding-responsive-md'} border-t border-gray-100 fade-in`}>
            <div className="flex items-center gap-responsive-xs space-responsive-sm">
              <span className={`font-medium text-gray-500 uppercase tracking-responsive-wide ${isMobile ? 'text-responsive-xs' : 'text-responsive-xs'}`}>
                Indicators
              </span>
            </div>
            <div className="flex flex-wrap gap-responsive-xs">
              {indicators.slice(0, getIndicatorDisplayCount()).map((indicator: any, index: number) => (
                <span
                  key={index}
                  className={`inline-flex items-center rounded-responsive-sm font-medium bg-gray-100 text-gray-700 micro-bounce ${
                    isMobile 
                      ? 'padding-responsive-xs text-responsive-xs' 
                      : 'padding-responsive-sm text-responsive-xs'
                  }`}
                >
                  <span className={isMobile ? 'truncate max-w-[80px]' : ''}>
                    {indicator.name}
                  </span>
                </span>
              ))}
              {indicators.length > getIndicatorDisplayCount() && (
                <span className={`inline-flex items-center rounded-responsive-sm font-medium bg-gray-100 text-gray-500 ${
                  isMobile 
                    ? 'padding-responsive-xs text-responsive-xs' 
                    : 'padding-responsive-sm text-responsive-xs'
                }`}>
                  +{indicators.length - getIndicatorDisplayCount()} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyCard;
