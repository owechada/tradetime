import React from 'react';
import { cn } from '../../lib/utils';

export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveWrapperProps {
  children: React.ReactNode;
  spacing?: SpacingSize;
  verticalSpacing?: SpacingSize;
  horizontalSpacing?: SpacingSize;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Responsive wrapper component with adaptive spacing utilities
 * Provides consistent spacing behavior across different screen sizes
 */
export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  spacing,
  verticalSpacing,
  horizontalSpacing,
  className,
  as: Component = 'div',
}) => {
  // Spacing classes that scale responsively
  const spacingClasses = {
    xs: 'p-2 sm:p-3',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6 lg:p-8',
    lg: 'p-6 sm:p-8 lg:p-12',
    xl: 'p-8 sm:p-12 lg:p-16',
    '2xl': 'p-12 sm:p-16 lg:p-24',
  };

  const verticalSpacingClasses = {
    xs: 'py-2 sm:py-3',
    sm: 'py-3 sm:py-4',
    md: 'py-4 sm:py-6 lg:py-8',
    lg: 'py-6 sm:py-8 lg:py-12',
    xl: 'py-8 sm:py-12 lg:py-16',
    '2xl': 'py-12 sm:py-16 lg:py-24',
  };

  const horizontalSpacingClasses = {
    xs: 'px-2 sm:px-3',
    sm: 'px-3 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-12 lg:px-16',
    '2xl': 'px-12 sm:px-16 lg:px-24',
  };

  const wrapperClasses = cn(
    spacing && spacingClasses[spacing],
    verticalSpacing && verticalSpacingClasses[verticalSpacing],
    horizontalSpacing && horizontalSpacingClasses[horizontalSpacing],
    className
  );

  return (
    <Component className={wrapperClasses}>
      {children}
    </Component>
  );
};

/**
 * Section wrapper with responsive spacing and optional background
 */
export interface ResponsiveSectionProps {
  children: React.ReactNode;
  spacing?: SpacingSize;
  background?: 'none' | 'subtle' | 'card';
  className?: string;
}

export const ResponsiveSection: React.FC<ResponsiveSectionProps> = ({
  children,
  spacing = 'lg',
  background = 'none',
  className,
}) => {
  const backgroundClasses = {
    none: '',
    subtle: 'bg-gray-50 dark:bg-gray-900',
    card: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm',
  };

  return (
    <ResponsiveWrapper
      spacing={spacing}
      className={cn(backgroundClasses[background], className)}
      as="section"
    >
      {children}
    </ResponsiveWrapper>
  );
};