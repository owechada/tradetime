import { useEffect, useState, useCallback } from 'react';
import { useResponsive } from './useResponsive';
import {
  initializeResponsivePerformanceMonitoring,
  getResponsivePerformanceMonitor,
  PerformanceMetrics,
  ResponsivePerformanceAlert,
  PERFORMANCE_BUDGETS,
  checkResponsivePerformanceBudget
} from '../utils/performanceMonitoring';

export interface ResponsivePerformanceState {
  metrics: PerformanceMetrics[];
  alerts: ResponsivePerformanceAlert[];
  averageMetrics: Partial<PerformanceMetrics>;
  layoutShiftsByBreakpoint: Record<string, number>;
  cumulativeLayoutShift: number;
  isMonitoring: boolean;
  budgetViolations: string[];
}

export interface ResponsivePerformanceConfig {
  enableAlerts?: boolean;
  enableConsoleLogging?: boolean;
  maxMetricsHistory?: number;
  maxAlertsHistory?: number;
}

/**
 * Hook for responsive performance monitoring
 * Automatically tracks performance metrics based on device type
 */
export const useResponsivePerformanceMonitoring = (config: ResponsivePerformanceConfig = {}) => {
  const {
    enableAlerts = true,
    enableConsoleLogging = false,
    maxMetricsHistory = 50,
    maxAlertsHistory = 20
  } = config;

  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [performanceState, setPerformanceState] = useState<ResponsivePerformanceState>({
    metrics: [],
    alerts: [],
    averageMetrics: {},
    layoutShiftsByBreakpoint: {},
    cumulativeLayoutShift: 0,
    isMonitoring: false,
    budgetViolations: []
  });

  // Determine device type
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  // Initialize monitoring when device type changes
  useEffect(() => {
    const monitor = initializeResponsivePerformanceMonitoring(deviceType);
    
    if (monitor) {
      setPerformanceState(prev => ({ ...prev, isMonitoring: true }));

      // Set up metric callback
      monitor.onMetric((metric: PerformanceMetrics) => {
        setPerformanceState(prev => {
          const newMetrics = [...prev.metrics, metric].slice(-maxMetricsHistory);
          const averageMetrics = monitor.getAverageMetrics();
          const layoutShiftsByBreakpoint = monitor.getLayoutShiftsByBreakpoint();
          const cumulativeLayoutShift = monitor.getCumulativeLayoutShift();

          // Check budget violations
          const budgetCheck = checkResponsivePerformanceBudget(deviceType, metric);
          const budgetViolations = budgetCheck.violations;

          if (enableConsoleLogging && budgetViolations.length > 0) {
            console.warn('Performance budget violations:', budgetViolations);
          }

          return {
            ...prev,
            metrics: newMetrics,
            averageMetrics,
            layoutShiftsByBreakpoint,
            cumulativeLayoutShift,
            budgetViolations
          };
        });
      });

      // Set up alert callback if enabled
      if (enableAlerts) {
        monitor.onAlert((alert: ResponsivePerformanceAlert) => {
          setPerformanceState(prev => {
            const newAlerts = [...prev.alerts, alert].slice(-maxAlertsHistory);
            
            if (enableConsoleLogging) {
              console.warn('Performance alert:', alert);
            }

            return {
              ...prev,
              alerts: newAlerts
            };
          });
        });
      }
    }

    return () => {
      if (monitor) {
        monitor.disconnect();
        setPerformanceState(prev => ({ ...prev, isMonitoring: false }));
      }
    };
  }, [deviceType, enableAlerts, enableConsoleLogging, maxMetricsHistory, maxAlertsHistory]);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    const monitor = getResponsivePerformanceMonitor();
    if (monitor) {
      monitor.clearMetrics();
      setPerformanceState(prev => ({
        ...prev,
        metrics: [],
        alerts: [],
        averageMetrics: {},
        layoutShiftsByBreakpoint: {},
        cumulativeLayoutShift: 0,
        budgetViolations: []
      }));
    }
  }, []);

  // Get performance budget for current device
  const getPerformanceBudget = useCallback(() => {
    return PERFORMANCE_BUDGETS[deviceType];
  }, [deviceType]);

  // Check if current performance meets budget
  const checkBudgetCompliance = useCallback(() => {
    const budget = getPerformanceBudget();
    const { averageMetrics } = performanceState;
    
    return checkResponsivePerformanceBudget(deviceType, averageMetrics);
  }, [deviceType, performanceState.averageMetrics, getPerformanceBudget]);

  // Get performance score (0-100)
  const getPerformanceScore = useCallback(() => {
    const budget = getPerformanceBudget();
    const { averageMetrics } = performanceState;
    
    if (!averageMetrics.lcp && !averageMetrics.fid && !averageMetrics.cls) {
      return null; // No data yet
    }

    let score = 100;
    let factors = 0;

    // LCP scoring (0-40 points)
    if (averageMetrics.lcp) {
      factors++;
      if (averageMetrics.lcp <= budget.lcp * 0.5) {
        score += 0; // Perfect
      } else if (averageMetrics.lcp <= budget.lcp) {
        score -= 20; // Good
      } else {
        score -= 40; // Poor
      }
    }

    // FID scoring (0-30 points)
    if (averageMetrics.fid) {
      factors++;
      if (averageMetrics.fid <= budget.fid * 0.5) {
        score += 0; // Perfect
      } else if (averageMetrics.fid <= budget.fid) {
        score -= 15; // Good
      } else {
        score -= 30; // Poor
      }
    }

    // CLS scoring (0-30 points)
    if (averageMetrics.cls) {
      factors++;
      if (averageMetrics.cls <= budget.cls * 0.5) {
        score += 0; // Perfect
      } else if (averageMetrics.cls <= budget.cls) {
        score -= 15; // Good
      } else {
        score -= 30; // Poor
      }
    }

    return Math.max(0, Math.min(100, score));
  }, [performanceState.averageMetrics, getPerformanceBudget]);

  // Track component render time
  const trackComponentRender = useCallback((componentName: string, renderTime: number) => {
    const monitor = getResponsivePerformanceMonitor();
    if (monitor) {
      monitor.trackComponentRender(componentName, renderTime);
    }
  }, []);

  // Get recent alerts
  const getRecentAlerts = useCallback((minutes: number = 5) => {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return performanceState.alerts.filter(alert => alert.timestamp > cutoff);
  }, [performanceState.alerts]);

  // Get metrics by type
  const getMetricsByType = useCallback((metricType: keyof PerformanceMetrics) => {
    return performanceState.metrics
      .map(metric => metric[metricType])
      .filter(value => value !== undefined);
  }, [performanceState.metrics]);

  return {
    // State
    ...performanceState,
    deviceType,
    
    // Computed values
    performanceScore: getPerformanceScore(),
    budgetCompliance: checkBudgetCompliance(),
    performanceBudget: getPerformanceBudget(),
    
    // Actions
    clearMetrics,
    trackComponentRender,
    
    // Queries
    getRecentAlerts,
    getMetricsByType,
    
    // Utils
    isGoodPerformance: () => {
      const score = getPerformanceScore();
      return score !== null && score >= 80;
    },
    
    hasRecentAlerts: () => getRecentAlerts().length > 0,
    
    getWorstMetric: () => {
      const budget = getPerformanceBudget();
      const { averageMetrics } = performanceState;
      
      let worstMetric = null;
      let worstRatio = 0;
      
      if (averageMetrics.lcp && budget.lcp) {
        const ratio = averageMetrics.lcp / budget.lcp;
        if (ratio > worstRatio) {
          worstRatio = ratio;
          worstMetric = { name: 'LCP', value: averageMetrics.lcp, budget: budget.lcp, ratio };
        }
      }
      
      if (averageMetrics.fid && budget.fid) {
        const ratio = averageMetrics.fid / budget.fid;
        if (ratio > worstRatio) {
          worstRatio = ratio;
          worstMetric = { name: 'FID', value: averageMetrics.fid, budget: budget.fid, ratio };
        }
      }
      
      if (averageMetrics.cls && budget.cls) {
        const ratio = averageMetrics.cls / budget.cls;
        if (ratio > worstRatio) {
          worstRatio = ratio;
          worstMetric = { name: 'CLS', value: averageMetrics.cls, budget: budget.cls, ratio };
        }
      }
      
      return worstMetric;
    }
  };
};

/**
 * Hook for tracking component render performance
 */
export const useComponentPerformanceTracking = (componentName: string) => {
  const { trackComponentRender } = useResponsivePerformanceMonitoring();
  const [renderStartTime, setRenderStartTime] = useState<number | null>(null);

  const startTracking = useCallback(() => {
    setRenderStartTime(performance.now());
  }, []);

  const endTracking = useCallback(() => {
    if (renderStartTime) {
      const renderTime = performance.now() - renderStartTime;
      trackComponentRender(componentName, renderTime);
      setRenderStartTime(null);
      return renderTime;
    }
    return null;
  }, [renderStartTime, componentName, trackComponentRender]);

  // Auto-track render on mount
  useEffect(() => {
    startTracking();
    return () => {
      endTracking();
    };
  }, []);

  return {
    startTracking,
    endTracking,
    isTracking: renderStartTime !== null
  };
};