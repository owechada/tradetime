import React, { FC, ReactEventHandler } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { useAccessibility } from "../../hooks/useAccessibility";
import { useResponsivePolish } from "../../hooks/useResponsivePolish";
import "../../styles/responsive-polish.css";

interface ButtonProps {
  text: any;
  onBtnClick?: ReactEventHandler;
  width?: number;
  Icon?: any;
  OverideStyle?: string;
  outlined?: boolean;
  disabled?: any;
  style?: any;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  responsive?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const Button: FC<ButtonProps> = ({
  outlined,
  text,
  onBtnClick,
  disabled,
  width,
  Icon,
  OverideStyle,
  style,
  size = 'md',
  fullWidth = true,
  responsive = true,
  ariaLabel,
  ariaDescribedBy,
}) => {
  const { isMobile, isTablet } = useResponsive();
  const { 
    getAccessibilityClasses, 
    ariaAttributes,
    getKeyboardHandlers 
  } = useAccessibility({ 
    componentType: 'button', 
    size,
    focusVariant: outlined ? 'default' : 'primary'
  });
  
  const {
    addRippleEffect,
    addTouchFeedback,
    touchDevice,
    microInteractionsEnabled,
    getResponsiveSpacing,
  } = useResponsivePolish();

  // Responsive sizing
  const getResponsiveSize = () => {
    if (!responsive) return size;
    
    if (isMobile) {
      // Larger buttons on mobile for better touch targets
      return size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'lg';
    }
    
    return size;
  };

  const getSizeClasses = () => {
    const responsiveSize = getResponsiveSize();
    
    const sizeMap = {
      sm: {
        padding: 'py-2 px-4',
        text: 'text-xs',
        iconSize: 14,
        minHeight: 'min-h-[36px]'
      },
      md: {
        padding: 'py-3 px-6',
        text: 'text-sm',
        iconSize: 16,
        minHeight: 'min-h-[44px]' // Meets accessibility guidelines
      },
      lg: {
        padding: 'py-4 px-8',
        text: 'text-base',
        iconSize: 18,
        minHeight: 'min-h-[52px]'
      }
    };

    return sizeMap[responsiveSize];
  };

  const getWidthClasses = () => {
    if (width) {
      return `w-[${width}px]`;
    }
    
    if (fullWidth) {
      return "w-full";
    }
    
    return "w-auto";
  };

  const getIconSpacing = () => {
    if (isMobile) {
      return text ? "mr-3" : "mr-0"; // More spacing on mobile
    }
    return text ? "mr-2" : "mr-0";
  };

  const sizeClasses = getSizeClasses();
  const iconSize = Icon ? sizeClasses.iconSize : 18;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Add responsive polish effects
    if (microInteractionsEnabled) {
      addRippleEffect(event);
    }
    
    if (touchDevice) {
      addTouchFeedback(event.currentTarget);
    }

    onBtnClick?.(event);
  };

  const getPolishClasses = () => {
    const baseClasses = [
      'button-responsive',
      'button-micro',
      'transition-responsive',
      'focus-ring-responsive',
      touchDevice ? 'touch-feedback' : 'hover-lift',
    ];

    return baseClasses.join(' ');
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      type="button"
      aria-label={ariaLabel || (typeof text === 'string' ? text : undefined)}
      aria-describedby={ariaDescribedBy}
      {...ariaAttributes}
      {...getKeyboardHandlers()}
      className={getAccessibilityClasses(`inline-flex items-center justify-center rounded-xl font-semibold ${getPolishClasses()} ${
        outlined 
          ? "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md" 
          : `${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md hover:shadow-lg'}`
      } ${getWidthClasses()} ${sizeClasses.padding} ${sizeClasses.text} ${sizeClasses.minHeight} ${style} touch-manipulation`)}
    >
      {Icon && (
        <Icon
          size={iconSize}
          className={`${
            outlined ? "text-primary group-hover:text-white" : "text-white"
          } ${getIconSpacing()} ${OverideStyle}`}
        />
      )}
      {text && (
        <span className={`${OverideStyle}`}>
          {text}
        </span>
      )}
    </button>
  );
};

export default Button;
