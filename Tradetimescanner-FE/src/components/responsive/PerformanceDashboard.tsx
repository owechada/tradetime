import React, { useState } from 'react';
import { useResponsivePerformanceMonitoring } from '../../hooks/useResponsivePerformanceMonitoring';
import { useResponsive } from '../../hooks/useResponsive';

interface PerformanceDashboardProps {
  className?: string;
  showAlerts?: boolean;
  showMetrics?: boolean;
  showBudgets?: boolean;
}

/**
 * Performance Dashboard component for monitoring responsive performance
 * Shows real-time performance metrics, alerts, and budget compliance
 */
const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  className = '',
  showAlerts = true,
  showMetrics = true,
  showBudgets = true
}) => {
  const { isMobile } = useResponsive();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    performanceScore,
    averageMetrics,
    alerts,
    budgetCompliance,
    performanceBudget,
    layoutShiftsByBreakpoint,
    cumulativeLayoutShift,
    deviceType,
    isMonitoring,
    clearMetrics,
    getRecentAlerts,
    hasRecentAlerts,
    getWorstMetric,
    isGoodPerformance
  } = useResponsivePerformanceMonitoring({
    enableAlerts: true,
    enableConsoleLogging: false
  });

  const recentAlerts = getRecentAlerts(5);
  const worstMetric = getWorstMetric();

  // Don't render if not monitoring
  if (!isMonitoring) {
    return null;
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricColor = (value: number, budget: number) => {
    const ratio = value / budget;
    if (ratio <= 0.5) return 'text-green-600';
    if (ratio <= 1) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatMetric = (value: number | undefined, unit: string) => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
          isMobile ? 'text-sm' : 'text-base'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isGoodPerformance() ? 'bg-green-500' : hasRecentAlerts() ? 'bg-red-500' : 'bg-yellow-500'}`} />
          <span className="font-medium">Performance Monitor</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {deviceType}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {performanceScore !== null && (
            <span className={`font-semibold ${getScoreColor(performanceScore)}`}>
              {performanceScore.toFixed(0)}
            </span>
          )}
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Quick Stats */}
          <div className="p-3 bg-gray-50">
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
              <div className="text-center">
                <div className={`text-lg font-semibold ${getScoreColor(performanceScore)}`}>
                  {performanceScore?.toFixed(0) || 'N/A'}
                </div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-semibold ${getMetricColor(averageMetrics.lcp || 0, performanceBudget.lcp)}`}>
                  {formatMetric(averageMetrics.lcp, 'ms')}
                </div>
                <div className="text-xs text-gray-600">LCP</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-semibold ${getMetricColor(averageMetrics.fid || 0, performanceBudget.fid)}`}>
                  {formatMetric(averageMetrics.fid, 'ms')}
                </div>
                <div className="text-xs text-gray-600">FID</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-semibold ${getMetricColor(averageMetrics.cls || 0, performanceBudget.cls)}`}>
                  {formatMetric(averageMetrics.cls, '')}
                </div>
                <div className="text-xs text-gray-600">CLS</div>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          {showMetrics && (
            <div className="p-3">
              <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>First Contentful Paint:</span>
                  <span className={getMetricColor(averageMetrics.fcp || 0, performanceBudget.fcp)}>
                    {formatMetric(averageMetrics.fcp, 'ms')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Time to First Byte:</span>
                  <span className={getMetricColor(averageMetrics.ttfb || 0, performanceBudget.ttfb)}>
                    {formatMetric(averageMetrics.ttfb, 'ms')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Cumulative Layout Shift:</span>
                  <span className={getMetricColor(cumulativeLayoutShift, performanceBudget.cls)}>
                    {cumulativeLayoutShift.toFixed(3)}
                  </span>
                </div>
                
                {averageMetrics.interactionLatency && (
                  <div className="flex justify-between">
                    <span>Interaction Latency:</span>
                    <span className={getMetricColor(averageMetrics.interactionLatency, performanceBudget.fid)}>
                      {formatMetric(averageMetrics.interactionLatency, 'ms')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Layout Shifts by Breakpoint */}
          {Object.keys(layoutShiftsByBreakpoint).length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Layout Shifts by Breakpoint</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(layoutShiftsByBreakpoint).map(([breakpoint, shift]) => (
                  <div key={breakpoint} className="flex justify-between">
                    <span className="capitalize">{breakpoint}:</span>
                    <span className={getMetricColor(shift, performanceBudget.layoutShift)}>
                      {shift.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Budget */}
          {showBudgets && (
            <div className="p-3 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Performance Budget ({deviceType})</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>LCP Target:</span>
                  <span>{performanceBudget.lcp}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>FID Target:</span>
                  <span>{performanceBudget.fid}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>CLS Target:</span>
                  <span>{performanceBudget.cls}</span>
                </div>
              </div>
              
              {!budgetCompliance.passed && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                  <div className="font-medium text-red-800 mb-1">Budget Violations:</div>
                  {budgetCompliance.violations.map((violation, index) => (
                    <div key={index} className="text-red-700">{violation}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Alerts */}
          {showAlerts && recentAlerts.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Recent Alerts</h4>
              <div className="space-y-2">
                {recentAlerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-yellow-800 capitalize">
                        {alert.type.replace('_', ' ')}
                      </span>
                      <span className="text-yellow-600">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-yellow-700 mt-1">
                      {alert.metric}: {alert.value.toFixed(1)} &gt; {alert.threshold.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Worst Metric */}
          {worstMetric && (
            <div className="p-3 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Needs Attention</h4>
              <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                <div className="font-medium text-red-800">{worstMetric.name}</div>
                <div className="text-red-700">
                  {worstMetric.value.toFixed(1)} / {worstMetric.budget.toFixed(1)} 
                  ({(worstMetric.ratio * 100).toFixed(0)}% of budget)
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={clearMetrics}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Metrics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;