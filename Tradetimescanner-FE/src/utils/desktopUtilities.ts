// Desktop-specific utilities for performance optimization

export const desktopOptimizations = {
  // Full animation performance for desktop
  getAnimationDuration: (base: number) => base,
  
  // Enhanced interactions for desktop
  getTouchConfig: () => ({
    threshold: 5,
    velocity: 0.5,
    directional: false,
    multiTouch: true,
    hover: true
  }),
  
  // Desktop-specific image sizing
  getImageSizes: () => '(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw',
  
  // Higher data loading for desktop
  getPageSize: () => 25,
  
  // Desktop-optimized debounce
  getDebounceDelay: () => 50
};

export const desktopLayoutHelpers = {
  // Row layout preferred for desktop
  getFlexDirection: () => 'row' as const,
  
  // Constrained width for desktop
  getContainerWidth: () => '80%',
  
  // Full padding for desktop
  getPadding: (base: string) => base
};

export const desktopPerformance = {
  // Aggressive lazy loading for desktop
  getLazyLoadThreshold: () => 0.1,
  
  // Larger root margin for desktop
  getRootMargin: () => '100px',
  
  // Desktop-specific bundle priorities
  getBundlePriority: () => ['core', 'desktop', 'shared']
};