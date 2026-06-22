import React, { lazy } from 'react';
import { useResponsive } from '../hooks/useResponsive';

// Device-specific component loading
export const loadDeviceSpecificComponent = (
  mobileComponent: () => Promise<any>,
  tabletComponent?: () => Promise<any>,
  desktopComponent?: () => Promise<any>
) => {
  return {
    Mobile: lazy(mobileComponent),
    Tablet: lazy(tabletComponent || mobileComponent),
    Desktop: lazy(desktopComponent || tabletComponent || mobileComponent)
  };
};

// Conditional component loader based on device type
export const useDeviceComponent = <T extends React.ComponentType<any>>(
  components: {
    Mobile: T;
    Tablet?: T;
    Desktop?: T;
  }
) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile) return components.Mobile;
  if (isTablet) return components.Tablet || components.Mobile;
  if (isDesktop) return components.Desktop || components.Tablet || components.Mobile;
  
  return components.Mobile; // fallback
};

// Bundle splitting for device-specific utilities
export const loadDeviceUtilities = async (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  switch (deviceType) {
    case 'mobile':
      return import('./mobileUtilities');
    case 'tablet':
      return import('./tabletUtilities');
    case 'desktop':
      return import('./desktopUtilities');
    default:
      return import('./mobileUtilities');
  }
};

// Performance-optimized component wrapper
export const withDeviceOptimization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.memo((props: P) => {
    const { isMobile } = useResponsive();
    
    // Skip expensive operations on mobile
    const optimizedProps = isMobile 
      ? { ...props, reduceAnimations: true, simplifyLayout: true }
      : props;

    return React.createElement(Component, optimizedProps);
  });
};