import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { preloadCriticalResources, monitorBundleSize } from '../utils/bundleOptimization';
import { 
  getResponsivePerformanceMonitor, 
  initializeResponsivePerformanceMonitoring 
} from '../utils/performanceMonitoring';

interface PerformanceContextType {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isOptimizationEnabled: boolean;
  bundleSize: number;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceProviderProps {
  children: ReactNode;
  enableOptimizations?: boolean;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  enableOptimizations = true
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  const [bundleSize, setBundleSize] = React.useState(0);

  useEffect(() => {
    if (enableOptimizations) {
      // Start performance monitoring
      const monitor = initializeResponsivePerformanceMonitoring(deviceType);
      
      // Preload critical resources for the device
      preloadCriticalResources(deviceType);
      
      // Monitor bundle size
      const size = monitorBundleSize();
      setBundleSize(size);
      
      // Cleanup
      return () => {
        if (monitor) {
          monitor.disconnect();
        }
      };
    }
  }, [deviceType, enableOptimizations]);

  const value: PerformanceContextType = {
    deviceType,
    isOptimizationEnabled: enableOptimizations,
    bundleSize
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformanceContext = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformanceContext must be used within a PerformanceProvider');
  }
  return context;
};