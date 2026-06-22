import React, { useRef, useEffect } from 'react';
import { useResponsivePolish } from '../../hooks/useResponsivePolish';
import '../../styles/responsive-animations.css';
import '../../styles/responsive-typography.css';
import '../../styles/responsive-micro-interactions.css';

interface ResponsivePolishProps {
  children: React.ReactNode;
  enableAnimations?: boolean;
  enableMicroInteractions?: boolean;
  className?: string;
}

export const ResponsivePolish: React.FC<ResponsivePolishProps> = ({
  children,
  enableAnimations = true,
  enableMicroInteractions = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    animationsEnabled,
    microInteractionsEnabled,
    touchDevice,
    reducedMotion,
    highContrast,
    isMobile,
    isTablet,
    isDesktop,
    getAnimationClass,
    getMicroInteractionClass,
    getTouchClass,
    getContrastClass,
  } = useResponsivePolish({
    enableAnimations,
    enableMicroInteractions,
    respectReducedMotion: true,
    enableTouchFeedback: true,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Apply responsive polish classes based on device and preferences
    const classes = [
      'responsive-polish-container',
      getAnimationClass('animations-enabled'),
      getMicroInteractionClass('micro-interactions-enabled'),
      getTouchClass('touch-device'),
      getContrastClass('high-contrast'),
      isMobile ? 'mobile-device' : '',
      isTablet ? 'tablet-device' : '',
      isDesktop ? 'desktop-device' : '',
      reducedMotion ? 'reduced-motion' : '',
    ].filter(Boolean).join(' ');

    container.className = `${classes} ${className}`.trim();

    // Add CSS custom properties for dynamic values
    container.style.setProperty('--animation-duration', reducedMotion ? '0ms' : '200ms');
    container.style.setProperty('--micro-interaction-duration', reducedMotion ? '0ms' : '150ms');
    container.style.setProperty('--touch-feedback-scale', touchDevice ? '0.95' : '0.98');

  }, [
    animationsEnabled,
    microInteractionsEnabled,
    touchDevice,
    reducedMotion,
    highContrast,
    isMobile,
    isTablet,
    isDesktop,
    className,
    getAnimationClass,
    getMicroInteractionClass,
    getTouchClass,
    getContrastClass,
  ]);

  return (
    <div ref={containerRef} className="responsive-polish-wrapper">
      {children}
    </div>
  );
};

// Enhanced Button component with responsive polish
interface PolishedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const PolishedButton: React.FC<PolishedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const {
    addRippleEffect,
    addTouchFeedback,
    touchDevice,
    microInteractionsEnabled,
  } = useResponsivePolish();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (microInteractionsEnabled) {
      addRippleEffect(event);
    }
    
    if (touchDevice) {
      addTouchFeedback(event.currentTarget);
    }

    onClick?.(event);
  };

  const baseClasses = [
    'button-responsive',
    'button-micro',
    'button-spacing-responsive',
    'transition-responsive',
    'focus-ring-responsive',
    touchDevice ? 'touch-feedback' : 'hover-lift',
  ];

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizeClasses = {
    sm: 'button-spacing-responsive-sm text-responsive-sm',
    md: 'button-spacing-responsive text-responsive-base',
    lg: 'button-spacing-responsive-lg text-responsive-lg',
  };

  const classes = [
    ...baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={handleClick}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="loading-spin inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
      )}
      {children}
    </button>
  );
};

// Enhanced Card component with responsive polish
interface PolishedCardProps {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PolishedCard: React.FC<PolishedCardProps> = ({
  children,
  interactive = false,
  className = '',
  onClick,
}) => {
  const { touchDevice, addTouchFeedback } = useResponsivePolish();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactive && touchDevice) {
      addTouchFeedback(event.currentTarget);
    }
    onClick?.();
  };

  const classes = [
    'card-spacing-responsive',
    'rounded-responsive-lg',
    'bg-white',
    'border',
    'border-gray-200',
    interactive ? 'card-micro cursor-pointer' : '',
    interactive && touchDevice ? 'touch-feedback' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={handleClick}>
      {children}
    </div>
  );
};

// Enhanced Input component with responsive polish
interface PolishedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export const PolishedInput: React.FC<PolishedInputProps> = ({
  label,
  error,
  success,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'input-responsive',
    'input-micro',
    'w-full',
    'padding-responsive-sm',
    'rounded-responsive-md',
    'text-responsive-base',
    error ? 'error' : '',
    success ? 'success' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="form-field-spacing-responsive">
      {label && (
        <label className="block text-responsive-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="text-responsive-xs text-red-600 mt-1 fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

// Enhanced Navigation component with responsive polish
interface PolishedNavProps {
  items: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  className?: string;
}

export const PolishedNav: React.FC<PolishedNavProps> = ({
  items,
  className = '',
}) => {
  return (
    <nav className={`nav-spacing-responsive ${className}`}>
      <ul className="flex gap-responsive-sm">
        {items.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className={[
                'nav-item-micro',
                'nav-item-spacing-responsive',
                'text-responsive-base',
                'transition-responsive',
                item.active ? 'active' : '',
              ].join(' ')}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ResponsivePolish;