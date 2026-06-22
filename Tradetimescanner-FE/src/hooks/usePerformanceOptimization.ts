import { useEffect, useMemo } from 'react';
import { useResponsive } from './useResponsive';
import { loadDeviceUtilities } from '../utils/deviceCodeSplitting';
import { 
  getResponsivePerformanceMonitor, 
  initializeResponsivePerformanceMonitoring 
} from '../utils/performanceMonitoring';

interface PerformanceConfig {
  enableLazyLoading?: boolean;
  enableImageOptimization?: boolean;
  enableBundleSplitting?: boolean;
  enablePerformanceMonitoring?: boolean;
}

export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const {
    enableLazyLoading = true,
    enableImageOptimization = true,
    enableBundleSplitting = true,
    enablePerformanceMonitoring = true
  } = config;

  // Get device type
  const deviceType = useMemo(() => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }, [isMobile, isTablet, isDesktop]);

  // Load device-specific utilities
  const deviceUtils = useMemo(async () => {
    if (enableBundleSplitting) {
      return await loadDeviceUtilities(deviceType);
    }
    return null;
  }, [deviceType, enableBundleSplitting]);

  // Performance monitoring
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      const monitor = initializeResponsivePerformanceMonitoring(deviceType);
      
      return () => {
        if (monitor) {
          monitor.disconnect();
        }
      };
    }
  }, [deviceType, enablePerformanceMonitoring]);

  // Get optimized settings based on device
  const getOptimizedSettings = useMemo(() => {
    const baseSettings = {
      lazyLoadThreshold: 0.1,
      rootMargin: '50px',
      animationDuration: 300,
      pageSize: 20,
      debounceDelay: 100
    };

    if (isMobile) {
      return {
        ...baseSettings,
        lazyLoadThreshold: 0.2,
        rootMargin: '25px',
        animationDuration: 200,
        pageSize: 10,
        debounceDelay: 150
      };
    }

    if (isTablet) {
      return {
        ...baseSettings,
        lazyLoadThreshold: 0.15,
        rootMargin: '50px',
        animationDuration: 250,
        pageSize: 15,
        debounceDelay: 100
      };
    }

    return baseSettings;
  }, [isMobile, isTablet]);

  // Image optimization settings
  const getImageSizes = useMemo(() => {
    if (!enableImageOptimization) return undefined;
    
    if (isMobile) {
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw';
    }
    if (isTablet) {
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    }
    return '(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw';
  }, [isMobile, isTablet, enableImageOptimization]);

  return {
    deviceType,
    deviceUtils,
    optimizedSettings: getOptimizedSettings,
    imageSizes: getImageSizes,
    shouldReduceAnimations: isMobile,
    shouldLimitData: isMobile,
    shouldUseSimplifiedUI: isMobile
  };
};