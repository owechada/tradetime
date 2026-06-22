// Bundle optimization utilities for device-specific code splitting

export const createDeviceSpecificImport = (
  mobileImport: () => Promise<any>,
  tabletImport?: () => Promise<any>,
  desktopImport?: () => Promise<any>
) => {
  return {
    mobile: mobileImport,
    tablet: tabletImport || mobileImport,
    desktop: desktopImport || tabletImport || mobileImport
  };
};

// Preload critical resources based on device
export const preloadCriticalResources = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  const criticalResources = {
    mobile: [
      '/static/css/mobile-critical.css',
      '/static/js/mobile-core.js'
    ],
    tablet: [
      '/static/css/tablet-critical.css',
      '/static/js/tablet-core.js'
    ],
    desktop: [
      '/static/css/desktop-critical.css',
      '/static/js/desktop-core.js'
    ]
  };

  const resources = criticalResources[deviceType] || criticalResources.mobile;
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
};

// Dynamic import with device-specific fallbacks
export const importWithDeviceFallback = async (
  deviceType: 'mobile' | 'tablet' | 'desktop',
  imports: {
    mobile: () => Promise<any>;
    tablet?: () => Promise<any>;
    desktop?: () => Promise<any>;
  }
) => {
  try {
    switch (deviceType) {
      case 'mobile':
        return await imports.mobile();
      case 'tablet':
        return await (imports.tablet || imports.mobile)();
      case 'desktop':
        return await (imports.desktop || imports.tablet || imports.mobile)();
      default:
        return await imports.mobile();
    }
  } catch (error) {
    console.warn(`Failed to load ${deviceType} specific module, falling back to mobile:`, error);
    return await imports.mobile();
  }
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && 
      resource.transferSize > 0
    );

    const totalJSSize = jsResources.reduce((total, resource) => 
      total + (resource.transferSize || 0), 0
    );

    console.log('Bundle Analysis:', {
      totalJSSize: `${(totalJSSize / 1024).toFixed(2)}KB`,
      resourceCount: jsResources.length,
      largestBundle: jsResources
        .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))[0]
    });

    return totalJSSize;
  }
  
  return 0;
};