// Mobile-specific utilities for performance optimization

export const mobileOptimizations = {
  // Reduce animation complexity on mobile
  getAnimationDuration: (base: number) => Math.min(base * 0.7, 200),
  
  // Simplified touch interactions
  getTouchConfig: () => ({
    threshold: 10,
    velocity: 0.3,
    directional: true
  }),
  
  // Mobile-specific image sizing
  getImageSizes: () => '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw',
  
  // Reduced data loading for mobile
  getPageSize: () => 10,
  
  // Mobile-optimized debounce
  getDebounceDelay: () => 150
};

export const mobileLayoutHelpers = {
  // Stack layout for mobile
  getFlexDirection: () => 'column' as const,
  
  // Full width on mobile
  getContainerWidth: () => '100%',
  
  // Reduced padding for mobile
  getPadding: (base: string) => {
    const value = parseInt(base);
    return `${Math.max(value * 0.6, 8)}px`;
  }
};

export const mobilePerformance = {
  // Lazy load threshold for mobile
  getLazyLoadThreshold: () => 0.2,
  
  // Reduced root margin for mobile
  getRootMargin: () => '25px',
  
  // Mobile-specific bundle priorities
  getBundlePriority: () => ['core', 'mobile', 'shared']
};