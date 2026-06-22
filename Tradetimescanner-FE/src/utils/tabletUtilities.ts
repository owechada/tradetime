// Tablet-specific utilities for performance optimization

export const tabletOptimizations = {
  // Balanced animation performance for tablet
  getAnimationDuration: (base: number) => Math.min(base * 0.85, 300),
  
  // Enhanced touch interactions for tablet
  getTouchConfig: () => ({
    threshold: 8,
    velocity: 0.4,
    directional: true,
    multiTouch: true
  }),
  
  // Tablet-specific image sizing
  getImageSizes: () => '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  
  // Moderate data loading for tablet
  getPageSize: () => 15,
  
  // Tablet-optimized debounce
  getDebounceDelay: () => 100
};

export const tabletLayoutHelpers = {
  // Flexible layout for tablet
  getFlexDirection: (isLandscape: boolean) => isLandscape ? 'row' : 'column' as const,
  
  // Adaptive width for tablet
  getContainerWidth: () => '90%',
  
  // Moderate padding for tablet
  getPadding: (base: string) => {
    const value = parseInt(base);
    return `${Math.max(value * 0.8, 12)}px`;
  }
};

export const tabletPerformance = {
  // Balanced lazy load threshold for tablet
  getLazyLoadThreshold: () => 0.15,
  
  // Moderate root margin for tablet
  getRootMargin: () => '50px',
  
  // Tablet-specific bundle priorities
  getBundlePriority: () => ['core', 'tablet', 'shared', 'desktop']
};