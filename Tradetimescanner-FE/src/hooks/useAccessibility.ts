import { useEffect, useRef, useState } from 'react';
import { useResponsive } from './useResponsive';
import {
  getTouchTargetClasses,
  getFocusRingClasses,
  getResponsiveAriaAttributes,
  ResponsiveFocusManager,
  validateAccessibility,
  ACCESSIBILITY_CONSTANTS
} from '../utils/accessibilityUtils';

export interface UseAccessibilityOptions {
  componentType?: 'button' | 'input' | 'navigation' | 'modal';
  size?: 'sm' | 'md' | 'lg';
  focusVariant?: 'default' | 'primary' | 'error';
  enableFocusTrap?: boolean;
  validateOnMount?: boolean;
}

export interface AccessibilityState {
  touchTargetClasses: string;
  focusRingClasses: string;
  ariaAttributes: Record<string, any>;
  isAccessible: boolean;
  accessibilityIssues: string[];
}

/**
 * Hook for managing accessibility features in responsive components
 */
export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    componentType = 'button',
    size = 'md',
    focusVariant = 'default',
    enableFocusTrap = false,
    validateOnMount = false
  } = options;

  const { isMobile, isTablet, isDesktop } = useResponsive();
  const elementRef = useRef<HTMLElement>(null);
  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    touchTargetClasses: '',
    focusRingClasses: '',
    ariaAttributes: {},
    isAccessible: true,
    accessibilityIssues: []
  });

  const focusManager = ResponsiveFocusManager.getInstance();

  // Determine device type for accessibility calculations
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  // Update accessibility classes when device type or options change
  useEffect(() => {
    const touchTargetClasses = getTouchTargetClasses(deviceType, size);
    const focusRingClasses = getFocusRingClasses(focusVariant);
    const ariaAttributes = getResponsiveAriaAttributes(deviceType, componentType);

    setAccessibilityState(prev => ({
      ...prev,
      touchTargetClasses,
      focusRingClasses,
      ariaAttributes
    }));
  }, [deviceType, size, focusVariant, componentType]);

  // Validate accessibility on mount if requested
  useEffect(() => {
    if (validateOnMount && elementRef.current) {
      const validation = validateAccessibility(elementRef.current);
      setAccessibilityState(prev => ({
        ...prev,
        isAccessible: validation.isValid,
        accessibilityIssues: validation.issues
      }));
    }
  }, [validateOnMount]);

  // Focus trap management
  useEffect(() => {
    if (enableFocusTrap && elementRef.current) {
      focusManager.trapFocus(elementRef.current);
      return () => {
        focusManager.releaseFocusTrap();
      };
    }
  }, [enableFocusTrap]);

  /**
   * Manually validate accessibility of the current element
   */
  const validateElement = () => {
    if (elementRef.current) {
      const validation = validateAccessibility(elementRef.current);
      setAccessibilityState(prev => ({
        ...prev,
        isAccessible: validation.isValid,
        accessibilityIssues: validation.issues
      }));
      return validation;
    }
    return { isValid: false, issues: ['Element not found'] };
  };

  /**
   * Set focus to the element with proper error handling
   */
  const setFocus = (options?: FocusOptions) => {
    if (elementRef.current) {
      focusManager.setFocus(elementRef.current, options);
    }
  };

  /**
   * Move focus to next focusable element
   */
  const focusNext = () => {
    if (elementRef.current) {
      const nextElement = focusManager.getNextFocusableElement(elementRef.current);
      if (nextElement) {
        focusManager.setFocus(nextElement);
      }
    }
  };

  /**
   * Move focus to previous focusable element
   */
  const focusPrevious = () => {
    if (elementRef.current) {
      const prevElement = focusManager.getPreviousFocusableElement(elementRef.current);
      if (prevElement) {
        focusManager.setFocus(prevElement);
      }
    }
  };

  /**
   * Get combined accessibility classes
   */
  const getAccessibilityClasses = (additionalClasses = '') => {
    return `${accessibilityState.touchTargetClasses} ${accessibilityState.focusRingClasses} ${additionalClasses}`.trim();
  };

  /**
   * Get touch target size for current device
   */
  const getTouchTargetSize = () => {
    return ACCESSIBILITY_CONSTANTS.TOUCH_TARGETS[deviceType];
  };

  /**
   * Check if current device requires larger touch targets
   */
  const requiresLargeTouchTargets = () => {
    return isMobile || isTablet;
  };

  /**
   * Get keyboard event handlers for accessibility
   */
  const getKeyboardHandlers = () => {
    return {
      onKeyDown: (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'Tab':
            // Tab navigation is handled by browser, but we can add custom logic here
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            if (componentType === 'navigation') {
              e.preventDefault();
              focusNext();
            }
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            if (componentType === 'navigation') {
              e.preventDefault();
              focusPrevious();
            }
            break;
          case 'Escape':
            if (componentType === 'modal' && enableFocusTrap) {
              // Custom escape handling can be added here
            }
            break;
        }
      }
    };
  };

  return {
    elementRef,
    accessibilityState,
    validateElement,
    setFocus,
    focusNext,
    focusPrevious,
    getAccessibilityClasses,
    getTouchTargetSize,
    requiresLargeTouchTargets,
    getKeyboardHandlers,
    deviceType,
    
    // Convenience getters
    touchTargetClasses: accessibilityState.touchTargetClasses,
    focusRingClasses: accessibilityState.focusRingClasses,
    ariaAttributes: accessibilityState.ariaAttributes,
    isAccessible: accessibilityState.isAccessible,
    accessibilityIssues: accessibilityState.accessibilityIssues
  };
};

/**
 * Hook for managing skip links
 */
export const useSkipLinks = () => {
  const [skipLinks, setSkipLinks] = useState<Array<{ id: string; label: string }>>([]);

  const addSkipLink = (id: string, label: string) => {
    setSkipLinks(prev => [...prev.filter(link => link.id !== id), { id, label }]);
  };

  const removeSkipLink = (id: string) => {
    setSkipLinks(prev => prev.filter(link => link.id !== id));
  };

  const skipToContent = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return {
    skipLinks,
    addSkipLink,
    removeSkipLink,
    skipToContent
  };
};

/**
 * Hook for managing reduced motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getAnimationClasses = (normalClasses: string, reducedClasses = '') => {
    return prefersReducedMotion ? reducedClasses : normalClasses;
  };

  return {
    prefersReducedMotion,
    getAnimationClasses
  };
};

/**
 * Hook for managing high contrast mode
 */
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    // Check for high contrast mode (Windows)
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getContrastClasses = (normalClasses: string, highContrastClasses: string) => {
    return prefersHighContrast ? highContrastClasses : normalClasses;
  };

  return {
    prefersHighContrast,
    getContrastClasses
  };
};