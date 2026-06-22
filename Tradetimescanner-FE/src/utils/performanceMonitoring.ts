/**
 * Enhanced performance monitoring utilities for responsive applications
 * Tracks Core Web Vitals and device-specific performance metrics with responsive layout shift monitoring
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenSize: string;
  connectionType?: string;
  memoryInfo?: any;
  timestamp: number;
  
  // Responsive-specific metrics
  layoutShiftsByBreakpoint?: Record<string, number>;
  renderTime?: number;
  interactionLatency?: number;
}

export interface PerformanceBudget {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  layoutShift: number;
  renderTime: number;
}

export interface ResponsivePerformanceAlert {
  type: 'budget_violation' | 'layout_shift' | 'slow_interaction' | 'memory_warning';
  deviceType: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
  context?: any;
}

// Enhanced performance budgets by device type (in milliseconds, except CLS which is unitless)
export const PERFORMANCE_BUDGETS: Record<string, PerformanceBudget> = {
  mobile: {
    lcp: 4000,  // 4 seconds
    fid: 300,   // 300ms
    cls: 0.25,  // 0.25 unitless
    fcp: 3000,  // 3 seconds
    ttfb: 1800, // 1.8 seconds
    layoutShift: 0.1, // Per layout shift
    renderTime: 100 // Component render time
  },
  tablet: {
    lcp: 3000,  // 3 seconds
    fid: 200,   // 200ms
    cls: 0.1,   // 0.1 unitless
    fcp: 2000,  // 2 seconds
    ttfb: 1200, // 1.2 seconds
    layoutShift: 0.05,
    renderTime: 80
  },
  desktop: {
    lcp: 2500,  // 2.5 seconds
    fid: 100,   // 100ms
    cls: 0.1,   // 0.1 unitless
    fcp: 1800,  // 1.8 seconds
    ttfb: 800,  // 800ms
    layoutShift: 0.05,
    renderTime: 60
  }
};

class ResponsivePerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observer: PerformanceObserver | null = null;
  private layoutShiftObserver: PerformanceObserver | null = null;
  private deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  private onMetricCallback?: (metric: PerformanceMetrics) => void;
  private onAlertCallback?: (alert: ResponsivePerformanceAlert) => void;
  private cumulativeLayoutShift = 0;
  private layoutShiftsByBreakpoint: Record<string, number> = {};
  private interactionStartTime: number | null = null;

  constructor(deviceType: 'mobile' | 'tablet' | 'desktop') {
    this.deviceType = deviceType;
    this.initializeObservers();
    this.setupInteractionTracking();
  }

  private initializeObservers() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Main performance observer
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processEntry(entry);
        }
      });

      this.observer.observe({ 
        entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'navigation'] 
      });

      // Dedicated layout shift observer for responsive monitoring
      this.layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processLayoutShift(entry as any);
        }
      });

      this.layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }

  private setupInteractionTracking() {
    if (typeof window === 'undefined') return;

    // Track interaction latency
    ['click', 'touchstart', 'keydown'].forEach(eventType => {
      window.addEventListener(eventType, () => {
        this.interactionStartTime = performance.now();
      }, { passive: true });
    });

    // Track when interaction completes (next frame)
    ['click', 'touchend', 'keyup'].forEach(eventType => {
      window.addEventListener(eventType, () => {
        if (this.interactionStartTime) {
          requestAnimationFrame(() => {
            const latency = performance.now() - this.interactionStartTime!;
            this.trackInteractionLatency(latency);
            this.interactionStartTime = null;
          });
        }
      }, { passive: true });
    });
  }

  private processEntry(entry: PerformanceEntry) {
    const baseMetric: Partial<PerformanceMetrics> = {
      deviceType: this.deviceType,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: Date.now(),
      connectionType: this.getConnectionType(),
      memoryInfo: this.getMemoryInfo()
    };

    let metric: PerformanceMetrics | null = null;

    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          metric = { ...baseMetric, fcp: entry.startTime } as PerformanceMetrics;
        }
        break;
      
      case 'largest-contentful-paint':
        metric = { ...baseMetric, lcp: entry.startTime } as PerformanceMetrics;
        break;
      
      case 'first-input':
        const fidEntry = entry as any;
        metric = { 
          ...baseMetric, 
          fid: fidEntry.processingStart - fidEntry.startTime 
        } as PerformanceMetrics;
        break;
      
      case 'navigation':
        const navEntry = entry as any;
        metric = { 
          ...baseMetric, 
          ttfb: navEntry.responseStart - navEntry.requestStart 
        } as PerformanceMetrics;
        break;
    }

    if (metric) {
      this.addMetric(metric);
    }
  }

  private processLayoutShift(entry: any) {
    if (entry.hadRecentInput) return;

    const shiftValue = entry.value;
    this.cumulativeLayoutShift += shiftValue;

    // Track layout shifts by breakpoint
    const breakpoint = this.getCurrentBreakpoint();
    this.layoutShiftsByBreakpoint[breakpoint] = 
      (this.layoutShiftsByBreakpoint[breakpoint] || 0) + shiftValue;

    const metric: PerformanceMetrics = {
      deviceType: this.deviceType,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: Date.now(),
      cls: this.cumulativeLayoutShift,
      layoutShiftsByBreakpoint: { ...this.layoutShiftsByBreakpoint }
    };

    this.addMetric(metric);

    // Check for layout shift budget violation
    const budget = PERFORMANCE_BUDGETS[this.deviceType];
    if (shiftValue > budget.layoutShift) {
      this.triggerAlert({
        type: 'layout_shift',
        deviceType: this.deviceType,
        metric: 'layout_shift',
        value: shiftValue,
        threshold: budget.layoutShift,
        timestamp: Date.now(),
        context: { breakpoint, cumulativeShift: this.cumulativeLayoutShift }
      });
    }
  }

  private trackInteractionLatency(latency: number) {
    const budget = PERFORMANCE_BUDGETS[this.deviceType];
    
    if (latency > budget.fid) {
      this.triggerAlert({
        type: 'slow_interaction',
        deviceType: this.deviceType,
        metric: 'interaction_latency',
        value: latency,
        threshold: budget.fid,
        timestamp: Date.now()
      });
    }

    const metric: PerformanceMetrics = {
      deviceType: this.deviceType,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: Date.now(),
      interactionLatency: latency
    };

    this.addMetric(metric);
  }

  private getCurrentBreakpoint(): string {
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getConnectionType(): string | undefined {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType;
    }
    return undefined;
  }

  private getMemoryInfo(): any {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  private addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Check against performance budget
    this.checkPerformanceBudget(metric);
    
    // Call callback if provided
    if (this.onMetricCallback) {
      this.onMetricCallback(metric);
    }

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  private checkPerformanceBudget(metric: PerformanceMetrics) {
    const budget = PERFORMANCE_BUDGETS[this.deviceType];
    const violations: string[] = [];

    if (metric.lcp && metric.lcp > budget.lcp) {
      violations.push(`LCP: ${metric.lcp}ms > ${budget.lcp}ms`);
      this.triggerAlert({
        type: 'budget_violation',
        deviceType: this.deviceType,
        metric: 'lcp',
        value: metric.lcp,
        threshold: budget.lcp,
        timestamp: Date.now()
      });
    }

    if (metric.fid && metric.fid > budget.fid) {
      violations.push(`FID: ${metric.fid}ms > ${budget.fid}ms`);
      this.triggerAlert({
        type: 'budget_violation',
        deviceType: this.deviceType,
        metric: 'fid',
        value: metric.fid,
        threshold: budget.fid,
        timestamp: Date.now()
      });
    }

    if (metric.cls && metric.cls > budget.cls) {
      violations.push(`CLS: ${metric.cls} > ${budget.cls}`);
      this.triggerAlert({
        type: 'budget_violation',
        deviceType: this.deviceType,
        metric: 'cls',
        value: metric.cls,
        threshold: budget.cls,
        timestamp: Date.now()
      });
    }

    if (violations.length > 0) {
      console.warn(`Performance budget violations for ${this.deviceType}:`, violations);
    }
  }

  private triggerAlert(alert: ResponsivePerformanceAlert) {
    if (this.onAlertCallback) {
      this.onAlertCallback(alert);
    }
  }

  // Public API
  public onMetric(callback: (metric: PerformanceMetrics) => void) {
    this.onMetricCallback = callback;
  }

  public onAlert(callback: (alert: ResponsivePerformanceAlert) => void) {
    this.onAlertCallback = callback;
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getLayoutShiftsByBreakpoint(): Record<string, number> {
    return { ...this.layoutShiftsByBreakpoint };
  }

  public getCumulativeLayoutShift(): number {
    return this.cumulativeLayoutShift;
  }

  public getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {};

    const totals = this.metrics.reduce((acc, metric) => {
      if (metric.lcp) acc.lcp = (acc.lcp || 0) + metric.lcp;
      if (metric.fid) acc.fid = (acc.fid || 0) + metric.fid;
      if (metric.cls) acc.cls = (acc.cls || 0) + metric.cls;
      if (metric.fcp) acc.fcp = (acc.fcp || 0) + metric.fcp;
      if (metric.ttfb) acc.ttfb = (acc.ttfb || 0) + metric.ttfb;
      if (metric.interactionLatency) acc.interactionLatency = (acc.interactionLatency || 0) + metric.interactionLatency;
      return acc;
    }, {} as any);

    const count = this.metrics.length;
    return {
      lcp: totals.lcp ? totals.lcp / count : undefined,
      fid: totals.fid ? totals.fid / count : undefined,
      cls: totals.cls ? totals.cls / count : undefined,
      fcp: totals.fcp ? totals.fcp / count : undefined,
      ttfb: totals.ttfb ? totals.ttfb / count : undefined,
      interactionLatency: totals.interactionLatency ? totals.interactionLatency / count : undefined,
      deviceType: this.deviceType
    };
  }

  public clearMetrics() {
    this.metrics = [];
    this.cumulativeLayoutShift = 0;
    this.layoutShiftsByBreakpoint = {};
  }

  public disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.layoutShiftObserver) {
      this.layoutShiftObserver.disconnect();
      this.layoutShiftObserver = null;
    }
  }

  // Component render time tracking
  public trackComponentRender(componentName: string, renderTime: number) {
    const budget = PERFORMANCE_BUDGETS[this.deviceType];
    
    if (renderTime > budget.renderTime) {
      this.triggerAlert({
        type: 'budget_violation',
        deviceType: this.deviceType,
        metric: 'render_time',
        value: renderTime,
        threshold: budget.renderTime,
        timestamp: Date.now(),
        context: { componentName }
      });
    }

    const metric: PerformanceMetrics = {
      deviceType: this.deviceType,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: Date.now(),
      renderTime
    };

    this.addMetric(metric);
  }
}

// Singleton instance
let performanceMonitorInstance: ResponsivePerformanceMonitor | null = null;

export const initializeResponsivePerformanceMonitoring = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  if (performanceMonitorInstance) {
    performanceMonitorInstance.disconnect();
  }
  
  performanceMonitorInstance = new ResponsivePerformanceMonitor(deviceType);
  return performanceMonitorInstance;
};

export const getResponsivePerformanceMonitor = (): ResponsivePerformanceMonitor | null => {
  return performanceMonitorInstance;
};

// Utility functions for responsive performance tracking
export const trackResponsiveLayoutShift = (callback: (shift: number, breakpoint: string) => void) => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {};
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const layoutShiftEntry = entry as any;
      if (!layoutShiftEntry.hadRecentInput) {
        const breakpoint = window.innerWidth < 640 ? 'mobile' : 
                          window.innerWidth < 1024 ? 'tablet' : 'desktop';
        callback(layoutShiftEntry.value, breakpoint);
      }
    }
  });

  observer.observe({ entryTypes: ['layout-shift'] });
  return () => observer.disconnect();
};

// Performance budget checker
export const checkResponsivePerformanceBudget = (
  deviceType: 'mobile' | 'tablet' | 'desktop',
  metrics: Partial<PerformanceMetrics>
): { passed: boolean; violations: string[] } => {
  const budget = PERFORMANCE_BUDGETS[deviceType];
  const violations: string[] = [];

  if (metrics.lcp && metrics.lcp > budget.lcp) {
    violations.push(`LCP exceeded: ${metrics.lcp}ms > ${budget.lcp}ms`);
  }
  if (metrics.fid && metrics.fid > budget.fid) {
    violations.push(`FID exceeded: ${metrics.fid}ms > ${budget.fid}ms`);
  }
  if (metrics.cls && metrics.cls > budget.cls) {
    violations.push(`CLS exceeded: ${metrics.cls} > ${budget.cls}`);
  }
  if (metrics.fcp && metrics.fcp > budget.fcp) {
    violations.push(`FCP exceeded: ${metrics.fcp}ms > ${budget.fcp}ms`);
  }
  if (metrics.renderTime && metrics.renderTime > budget.renderTime) {
    violations.push(`Render time exceeded: ${metrics.renderTime}ms > ${budget.renderTime}ms`);
  }

  return {
    passed: violations.length === 0,
    violations
  };
};

// Hook for component-level performance monitoring with responsive awareness
export const useResponsivePerformanceMonitoring = (componentName: string) => {
  const startTime = performance.now();

  return {
    markRenderComplete: () => {
      const renderTime = performance.now() - startTime;
      const monitor = getResponsivePerformanceMonitor();
      
      if (monitor) {
        monitor.trackComponentRender(componentName, renderTime);
      }
      
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }
  };
};