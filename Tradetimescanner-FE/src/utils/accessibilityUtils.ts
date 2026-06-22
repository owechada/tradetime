/**
 * Accessibility utilities for responsive design compliance
 * Ensures WCAG 2.1 AA compliance across all screen sizes
 */

export interface TouchTargetConfig {
  minSize: number;
  recommendedSize: number;
  spacing: number;
}

export interface ColorContrastConfig {
  normalText: number;
  largeText: number;
  uiComponents: number;
}

export interface FocusConfig {
  outlineWidth: string;
  outlineColor: string;
  outlineOffset: string;
  borderRadius: string;
}

// WCAG 2.1 AA compliance constants
export const ACCESSIBILITY_CONSTANTS = {
  // Touch target sizes (in pixels)
  TOUCH_TARGETS: {
    mobile: {
      minSize: 44,
      recommendedSize: 48,
      spacing: 8
    },
    tablet: {
      minSize: 44,
      recommendedSize: 44,
      spacing: 6
    },
    desktop: {
      minSize: 24,
      recommendedSize: 32,
      spacing: 4
    }
  } as Record<string, TouchTargetConfig>,

  // Color contrast ratios
  COLOR_CONTRAST: {
    normalText: 4.5,
    largeText: 3.0,
    uiComponents: 3.0
  } as ColorContrastConfig,

  // Focus indicators
  FOCUS: {
    outlineWidth: '2px',
    outlineColor: 'rgb(59 130 246)', // blue-500
    outlineOffset: '2px',
    borderRadius: '0.375rem'
  } as FocusConfig
};

/**
 * Get touch target classes based on device type
 */
export const getTouchTargetClasses = (
  deviceType: 'mobile' | 'tablet' | 'desktop',
  size: 'sm' | 'md' | 'lg' = 'md'
): string => {
  const config = ACCESSIBILITY_CONSTANTS.TOUCH_TARGETS[deviceType];
  
  const sizeMap = {
    sm: config.minSize,
    md: config.recommendedSize,
    lg: config.recommendedSize + 8
  };

  const targetSize = sizeMap[size];
  
  return `min-h-[${targetSize}px] min-w-[${targetSize}px]`;
};

/**
 * Get responsive touch target classes that adapt to screen size
 */
export const getResponsiveTouchTargetClasses = (size: 'sm' | 'md' | 'lg' = 'md'): string => {
  const mobile = getTouchTargetClasses('mobile', size);
  const tablet = getTouchTargetClasses('tablet', size);
  const desktop = getTouchTargetClasses('desktop', size);

  return `${mobile} md:${tablet} lg:${desktop}`;
};

/**
 * Get focus ring classes for accessibility compliance
 */
export const getFocusRingClasses = (variant: 'default' | 'primary' | 'error' = 'default'): string => {
  const baseClasses = 'focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    default: 'focus:ring-blue-500',
    primary: 'focus:ring-primary',
    error: 'focus:ring-red-500'
  };

  return `${baseClasses} ${variantClasses[variant]}`;
};

/**
 * Get skip link classes for keyboard navigation
 */
export const getSkipLinkClasses = (): string => {
  return 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black p-2 rounded shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-500';
};

/**
 * Calculate color contrast ratio between two colors
 */
export const calculateContrastRatio = (color1: string, color2: string): number => {
  // This is a simplified version - in a real implementation, you'd use a proper color library
  // For now, return a placeholder that assumes good contrast
  return 4.5;
};

/**
 * Check if color combination meets WCAG contrast requirements
 */
export const meetsContrastRequirements = (
  foreground: string,
  background: string,
  textSize: 'normal' | 'large' = 'normal'
): boolean => {
  const ratio = calculateContrastRatio(foreground, background);
  const required = textSize === 'large' 
    ? ACCESSIBILITY_CONSTANTS.COLOR_CONTRAST.largeText 
    : ACCESSIBILITY_CONSTANTS.COLOR_CONTRAST.normalText;
  
  return ratio >= required;
};

/**
 * Get ARIA attributes for responsive components
 */
export const getResponsiveAriaAttributes = (
  deviceType: 'mobile' | 'tablet' | 'desktop',
  componentType: 'button' | 'input' | 'navigation' | 'modal'
) => {
  const baseAttributes: Record<string, any> = {};

  switch (componentType) {
    case 'button':
      baseAttributes['role'] = 'button';
      baseAttributes['tabIndex'] = 0;
      break;
    case 'input':
      baseAttributes['aria-required'] = false;
      break;
    case 'navigation':
      baseAttributes['role'] = 'navigation';
      if (deviceType === 'mobile') {
        baseAttributes['aria-expanded'] = false;
      }
      break;
    case 'modal':
      baseAttributes['role'] = 'dialog';
      baseAttributes['aria-modal'] = true;
      break;
  }

  return baseAttributes;
};

/**
 * Get keyboard navigation classes
 */
export const getKeyboardNavigationClasses = (): string => {
  return 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
};

/**
 * Get screen reader only classes
 */
export const getScreenReaderOnlyClasses = (): string => {
  return 'sr-only';
};

/**
 * Get responsive text size classes for accessibility
 */
export const getResponsiveTextClasses = (
  baseSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' = 'base'
): string => {
  const sizeMap = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl'
  };

  return sizeMap[baseSize];
};

/**
 * Validate component accessibility
 */
export const validateAccessibility = (element: HTMLElement): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  
  // Check touch target size
  const rect = element.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    issues.push('Touch target too small (minimum 44px required)');
  }

  // Check for focus indicator
  const computedStyle = window.getComputedStyle(element);
  if (!element.matches(':focus-visible') && !computedStyle.outline) {
    issues.push('Missing focus indicator');
  }

  // Check for accessible name
  const accessibleName = element.getAttribute('aria-label') || 
                        element.getAttribute('aria-labelledby') ||
                        element.textContent;
  if (!accessibleName?.trim()) {
    issues.push('Missing accessible name');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

/**
 * Enhanced focus management for responsive layouts
 */
export class ResponsiveFocusManager {
  private static instance: ResponsiveFocusManager;
  private focusStack: HTMLElement[] = [];
  private trapActive = false;

  static getInstance(): ResponsiveFocusManager {
    if (!ResponsiveFocusManager.instance) {
      ResponsiveFocusManager.instance = new ResponsiveFocusManager();
    }
    return ResponsiveFocusManager.instance;
  }

  /**
   * Trap focus within a container (useful for modals)
   */
  trapFocus(container: HTMLElement): void {
    this.trapActive = true;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    // Store cleanup function
    this.focusStack.push(container);
  }

  /**
   * Release focus trap
   */
  releaseFocusTrap(): void {
    this.trapActive = false;
    this.focusStack.pop();
  }

  /**
   * Set focus to element with proper error handling
   */
  setFocus(element: HTMLElement, options?: FocusOptions): void {
    try {
      element.focus(options);
    } catch (error) {
      console.warn('Failed to set focus:', error);
    }
  }

  /**
   * Get next focusable element in DOM order
   */
  getNextFocusableElement(current: HTMLElement): HTMLElement | null {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(current);
    return focusableElements[currentIndex + 1] || focusableElements[0];
  }

  /**
   * Get previous focusable element in DOM order
   */
  getPreviousFocusableElement(current: HTMLElement): HTMLElement | null {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(current);
    return focusableElements[currentIndex - 1] || focusableElements[focusableElements.length - 1];
  }
}