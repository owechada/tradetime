import { useState, useEffect } from 'react';
import { BREAKPOINTS, Breakpoint } from './useResponsive';

/**
 * Enhanced media query hook with breakpoint support
 * Provides flexible media query matching with predefined breakpoints
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
};

/**
 * Hook to check if screen is at or above a specific breakpoint
 */
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const breakpointValue = BREAKPOINTS[breakpoint];
  return useMediaQuery(`(min-width: ${breakpointValue}px)`);
};

/**
 * Hook to check if screen is below a specific breakpoint
 */
export const useBreakpointDown = (breakpoint: Breakpoint): boolean => {
  const breakpointValue = BREAKPOINTS[breakpoint];
  return useMediaQuery(`(max-width: ${breakpointValue - 1}px)`);
};

/**
 * Hook to check if screen is between two breakpoints
 */
export const useBreakpointBetween = (
  minBreakpoint: Breakpoint,
  maxBreakpoint: Breakpoint
): boolean => {
  const minValue = BREAKPOINTS[minBreakpoint];
  const maxValue = BREAKPOINTS[maxBreakpoint];
  return useMediaQuery(`(min-width: ${minValue}px) and (max-width: ${maxValue - 1}px)`);
};

/**
 * Hook for common responsive patterns
 */
export const useResponsiveQueries = () => {
  const isMobile = useBreakpointDown('md');
  const isTablet = useBreakpointBetween('md', 'lg');
  const isDesktop = useBreakpoint('lg');
  const isLargeDesktop = useBreakpoint('xl');
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Convenience queries
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  };
};

/**
 * Hook for orientation detection
 */
export const useOrientation = () => {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  
  return {
    isPortrait,
    isLandscape,
    orientation: isPortrait ? 'portrait' as const : 'landscape' as const,
  };
};

/**
 * Hook for reduced motion preference
 */
export const usePrefersReducedMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * Hook for dark mode preference
 */
export const usePrefersDarkMode = (): boolean => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};