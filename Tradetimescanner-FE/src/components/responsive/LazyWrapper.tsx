import React, { ReactNode, Suspense } from 'react';
import { useLazyLoading } from '../../hooks/useLazyLoading';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  minHeight?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '100px',
  className = '',
  minHeight = 'auto'
}) => {
  const { elementRef, isIntersecting } = useLazyLoading({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  const defaultFallback = (
    <div 
      className="flex items-center justify-center bg-gray-50 animate-pulse"
      style={{ minHeight }}
    >
      <div className="w-8 h-8 bg-gray-200 rounded animate-spin"></div>
    </div>
  );

  return (
    <div ref={elementRef} className={className} style={{ minHeight }}>
      {isIntersecting ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};