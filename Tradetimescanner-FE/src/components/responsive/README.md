# Performance Optimization Components

This directory contains components and utilities for implementing lazy loading and performance optimizations across different device types.

## Components

### ResponsiveImage
Optimized image component with lazy loading and responsive sizing.

```tsx
import { ResponsiveImage } from './ResponsiveImage';

<ResponsiveImage
  src="path/to/image.jpg"
  alt="Description"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  placeholder="path/to/placeholder.jpg"
  loading="lazy"
/>
```

### LazyWrapper
Wrapper component that lazy loads its children when they enter the viewport.

```tsx
import { LazyWrapper } from './LazyWrapper';

<LazyWrapper
  threshold={0.1}
  rootMargin="50px"
  minHeight="200px"
>
  <ExpensiveComponent />
</LazyWrapper>
```

### OptimizedChart
Device-specific chart component that loads different implementations based on device type.

```tsx
import { OptimizedChart } from './OptimizedChart';

<OptimizedChart
  data={chartData}
  annotations={annotations}
  height={400}
/>
```

## Hooks

### useLazyLoading
Hook for implementing intersection observer-based lazy loading.

```tsx
import { useLazyLoading } from '../../hooks/useLazyLoading';

const { elementRef, isIntersecting } = useLazyLoading({
  threshold: 0.1,
  rootMargin: '50px',
  triggerOnce: true
});
```

### usePerformanceOptimization
Hook that provides device-specific optimization settings.

```tsx
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

const { 
  deviceType, 
  optimizedSettings, 
  imageSizes,
  shouldReduceAnimations 
} = usePerformanceOptimization();
```

## Utilities

### Device Code Splitting
Utilities for loading device-specific code bundles.

```tsx
import { loadDeviceUtilities, useDeviceComponent } from '../../utils/deviceCodeSplitting';

// Load device-specific utilities
const utils = await loadDeviceUtilities('mobile');

// Use device-specific components
const Component = useDeviceComponent({
  Mobile: MobileComponent,
  Tablet: TabletComponent,
  Desktop: DesktopComponent
});
```

### Performance Monitoring
Track performance metrics across different devices.

```tsx
import { performanceMonitor } from '../../utils/performanceMonitoring';

// Start monitoring
performanceMonitor.startMeasurement();

// End monitoring
performanceMonitor.endMeasurement('mobile', bundleSize);

// Get metrics
const metrics = performanceMonitor.getAverageMetrics('mobile');
```

## Provider

### PerformanceProvider
Context provider for performance optimization settings.

```tsx
import { PerformanceProvider } from '../../providers/PerformanceProvider';

<PerformanceProvider enableOptimizations={true}>
  <App />
</PerformanceProvider>
```

## Device-Specific Optimizations

### Mobile
- Reduced animation durations (70% of base)
- Simplified touch interactions
- Limited data loading (10 items per page)
- Higher lazy loading threshold (0.2)
- Smaller root margins (25px)

### Tablet
- Moderate animation durations (85% of base)
- Enhanced touch interactions with multi-touch
- Moderate data loading (15 items per page)
- Balanced lazy loading threshold (0.15)
- Standard root margins (50px)

### Desktop
- Full animation performance
- Complete feature set
- Higher data loading (25 items per page)
- Aggressive lazy loading threshold (0.1)
- Larger root margins (100px)

## Best Practices

1. **Always use LazyWrapper** for components that are not immediately visible
2. **Use ResponsiveImage** for all images to ensure proper sizing and lazy loading
3. **Implement device-specific optimizations** using the provided utilities
4. **Monitor performance** using the performance monitoring utilities
5. **Test on actual devices** to ensure optimizations are effective

## Performance Benefits

- **Reduced initial bundle size** through code splitting
- **Faster page load times** with lazy loading
- **Better user experience** on mobile devices
- **Optimized memory usage** with device-specific implementations
- **Improved Core Web Vitals** scores