import { useState, useEffect } from 'react';

// Breakpoint configuration matching the design document
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  currentBreakpoint: Breakpoint;
}

/**
 * Hook for device detection and breakpoint management
 * Provides comprehensive device information and responsive utilities
 */
export const useResponsive = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1024,
        screenHeight: 768,
        orientation: 'landscape',
        currentBreakpoint: 'lg',
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      screenWidth: width,
      screenHeight: height,
      orientation: width > height ? 'landscape' : 'portrait',
      currentBreakpoint: getCurrentBreakpoint(width),
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceInfo({
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
        screenWidth: width,
        screenHeight: height,
        orientation: width > height ? 'landscape' : 'portrait',
        currentBreakpoint: getCurrentBreakpoint(width),
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
};

/**
 * Helper function to determine current breakpoint based on width
 */
const getCurrentBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * Utility function to check if current screen matches breakpoint
 */
export const isBreakpoint = (breakpoint: Breakpoint, deviceInfo: DeviceInfo): boolean => {
  const breakpointValue = BREAKPOINTS[breakpoint];
  return deviceInfo.screenWidth >= breakpointValue;
};

/**
 * Utility function to check if current screen is between breakpoints
 */
export const isBetweenBreakpoints = (
  minBreakpoint: Breakpoint,
  maxBreakpoint: Breakpoint,
  deviceInfo: DeviceInfo
): boolean => {
  const minValue = BREAKPOINTS[minBreakpoint];
  const maxValue = BREAKPOINTS[maxBreakpoint];
  return deviceInfo.screenWidth >= minValue && deviceInfo.screenWidth < maxValue;
};