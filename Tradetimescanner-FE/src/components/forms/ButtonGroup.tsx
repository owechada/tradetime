import React, { ReactNode } from "react";
import { useResponsive } from "../../hooks/useResponsive";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical' | 'responsive';
  alignment?: 'left' | 'center' | 'right' | 'between' | 'around';
  spacing?: 'tight' | 'normal' | 'loose';
  wrap?: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = "",
  orientation = 'responsive',
  alignment = 'center',
  spacing = 'normal',
  wrap = true
}) => {
  const { isMobile, isTablet } = useResponsive();

  const getOrientationClasses = () => {
    if (orientation === 'responsive') {
      // Stack vertically on mobile, horizontal on larger screens
      return isMobile ? 'flex-col' : 'flex-row';
    }

    return orientation === 'vertical' ? 'flex-col' : 'flex-row';
  };

  const getAlignmentClasses = () => {
    const isVertical = orientation === 'vertical' || (orientation === 'responsive' && isMobile);

    if (isVertical) {
      const verticalAlignmentMap = {
        left: 'items-start',
        center: 'items-center',
        right: 'items-end',
        between: 'items-stretch',
        around: 'items-center'
      };
      return verticalAlignmentMap[alignment];
    }

    const horizontalAlignmentMap = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
      around: 'justify-around'
    };

    return horizontalAlignmentMap[alignment];
  };

  const getSpacingClasses = () => {
    const isVertical = orientation === 'vertical' || (orientation === 'responsive' && isMobile);

    const spacingMap = {
      tight: isVertical ? 'space-y-2' : 'space-x-2',
      normal: isVertical ? 'space-y-3' : 'space-x-3',
      loose: isVertical ? 'space-y-4' : 'space-x-4'
    };

    return spacingMap[spacing];
  };

  const getWrapClasses = () => {
    if (!wrap || orientation === 'vertical' || (orientation === 'responsive' && isMobile)) {
      return '';
    }
    return 'flex-wrap';
  };

  return (
    <div className={`flex ${getOrientationClasses()} ${getAlignmentClasses()} ${getSpacingClasses()} ${getWrapClasses()} ${className}`}>
      {children}
    </div>
  );
};

interface ActionButtonsProps {
  primaryAction?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
  cancelAction?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  primaryAction,
  secondaryAction,
  cancelAction,
  className = ""
}) => {
  const { isMobile } = useResponsive();

  return (
    <ButtonGroup
      className={className}
      orientation="responsive"
      alignment={isMobile ? "center" : "right"}
      spacing="normal"
    >
      {cancelAction && (
        <button
          type="button"
          onClick={cancelAction.onClick}
          className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500/50 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md ${isMobile ? 'w-full py-3 px-6 text-base min-h-[44px]' : 'py-2.5 px-5 text-sm min-h-[40px]'
            }`}
        >
          {cancelAction.text}
        </button>
      )}

      {secondaryAction && (
        <button
          type="button"
          onClick={secondaryAction.onClick}
          disabled={secondaryAction.disabled}
          className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md ${secondaryAction.disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${isMobile ? 'w-full py-3 px-6 text-base min-h-[44px]' : 'py-2.5 px-5 text-sm min-h-[40px]'
            }`}
        >
          {secondaryAction.text}
        </button>
      )}

      {primaryAction && (
        <button
          type="submit"
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled || primaryAction.loading}
          className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 bg-gradient-to-r from-primary to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 ${primaryAction.disabled || primaryAction.loading ? 'opacity-50 cursor-not-allowed' : ''
            } ${isMobile ? 'w-full py-3 px-6 text-base min-h-[44px]' : 'py-2.5 px-5 text-sm min-h-[40px]'
            }`}
        >
          {primaryAction.loading && (
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {primaryAction.text}
        </button>
      )}
    </ButtonGroup>
  );
};

export { ButtonGroup, ActionButtons };