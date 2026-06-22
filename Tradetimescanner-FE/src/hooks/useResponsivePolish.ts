import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from './useMediaQuery';

interface ResponsivePolishOptions {
  enableAnimations?: boolean;
  enableMicroInteractions?: boolean;
  respectReducedMotion?: boolean;
  enableTouchFeedback?: boolean;
}

interface ResponsivePolishState {
  animationsEnabled: boolean;
  microInteractionsEnabled: boolean;
  touchDevice: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  devicePixelRatio: number;
}

export const useResponsivePolish = (options: ResponsivePolishOptions = {}) => {
  const {
    enableAnimations = true,
    enableMicroInteractions = true,
    respectReducedMotion = true,
    enableTouchFeedback = true,
  } = options;

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
  const isHighDPI = useMediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)');

  const [state, setState] = useState<ResponsivePolishState>({
    animationsEnabled: enableAnimations,
    microInteractionsEnabled: enableMicroInteractions,
    touchDevice: false,
    reducedMotion: false,
    highContrast: false,
    devicePixelRatio: 1,
  });

  const animationFrameRef = useRef<number>();

  useEffect(() => {
    setState(prev => ({
      ...prev,
      touchDevice: isTouchDevice,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
      devicePixelRatio: window.devicePixelRatio || 1,
      animationsEnabled: respectReducedMotion 
        ? enableAnimations && !prefersReducedMotion 
        : enableAnimations,
      microInteractionsEnabled: respectReducedMotion 
        ? enableMicroInteractions && !prefersReducedMotion 
        : enableMicroInteractions,
    }));
  }, [
    isTouchDevice,
    prefersReducedMotion,
    prefersHighContrast,
    enableAnimations,
    enableMicroInteractions,
    respectReducedMotion,
  ]);

  // Smooth scroll utility
  const smoothScrollTo = (element: HTMLElement | string, offset = 0) => {
    const target = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element;

    if (!target) return;

    const targetPosition = target.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = state.reducedMotion ? 0 : Math.min(Math.abs(distance) / 2, 1000);
    let start: number | null = null;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animation);
      }
    };

    if (duration > 0) {
      animationFrameRef.current = requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  };

  // Add ripple effect to element
  const addRippleEffect = (event: React.MouseEvent<HTMLElement>) => {
    if (!state.microInteractionsEnabled || state.reducedMotion) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
    `;

    // Add ripple animation keyframes if not already added
    if (!document.querySelector('#ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // Add focus ring to element
  const addFocusRing = (element: HTMLElement) => {
    if (!state.microInteractionsEnabled) return;

    element.style.outline = 'none';
    element.style.boxShadow = state.highContrast
      ? '0 0 0 3px #000000'
      : '0 0 0 3px rgba(59, 130, 246, 0.5)';
    element.style.transition = 'box-shadow 0.15s ease-in-out';
  };

  // Remove focus ring from element
  const removeFocusRing = (element: HTMLElement) => {
    element.style.boxShadow = 'none';
  };

  // Add hover effect to element
  const addHoverEffect = (element: HTMLElement, effect: 'lift' | 'scale' | 'glow' = 'lift') => {
    if (!state.microInteractionsEnabled || state.touchDevice) return;

    element.style.transition = 'all 0.2s ease-in-out';

    switch (effect) {
      case 'lift':
        element.style.transform = 'translateY(-2px)';
        element.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        break;
      case 'scale':
        element.style.transform = 'scale(1.02)';
        break;
      case 'glow':
        element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
        break;
    }
  };

  // Remove hover effect from element
  const removeHoverEffect = (element: HTMLElement) => {
    element.style.transform = '';
    element.style.boxShadow = '';
  };

  // Add touch feedback for mobile devices
  const addTouchFeedback = (element: HTMLElement) => {
    if (!enableTouchFeedback || !state.touchDevice) return;

    element.style.transition = 'transform 0.1s ease-in-out';
    element.style.transform = 'scale(0.95)';

    setTimeout(() => {
      element.style.transform = '';
    }, 150);
  };

  // Apply responsive typography scaling
  const getResponsiveTextSize = (baseSize: number, scaleFactor = 1) => {
    const viewportWidth = window.innerWidth;
    const minSize = baseSize * 0.8;
    const maxSize = baseSize * 1.2;
    
    if (isMobile) {
      return Math.max(minSize, baseSize * 0.9 * scaleFactor);
    } else if (isTablet) {
      return baseSize * scaleFactor;
    } else {
      return Math.min(maxSize, baseSize * 1.1 * scaleFactor);
    }
  };

  // Apply responsive spacing
  const getResponsiveSpacing = (baseSpacing: number, scaleFactor = 1) => {
    if (isMobile) {
      return baseSpacing * 0.8 * scaleFactor;
    } else if (isTablet) {
      return baseSpacing * scaleFactor;
    } else {
      return baseSpacing * 1.2 * scaleFactor;
    }
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    // State
    ...state,
    isMobile,
    isTablet,
    isDesktop,
    isHighDPI,

    // Utilities
    smoothScrollTo,
    addRippleEffect,
    addFocusRing,
    removeFocusRing,
    addHoverEffect,
    removeHoverEffect,
    addTouchFeedback,
    getResponsiveTextSize,
    getResponsiveSpacing,

    // CSS class helpers
    getAnimationClass: (baseClass: string) => 
      state.animationsEnabled ? baseClass : '',
    getMicroInteractionClass: (baseClass: string) => 
      state.microInteractionsEnabled ? baseClass : '',
    getTouchClass: (baseClass: string) => 
      state.touchDevice ? baseClass : '',
    getContrastClass: (baseClass: string) => 
      state.highContrast ? baseClass : '',
  };
};