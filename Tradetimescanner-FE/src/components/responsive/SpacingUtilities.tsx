import React from 'react';
import { cn } from '../../lib/utils';

export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Responsive spacer component for consistent vertical spacing
 */
export interface SpacerProps {
  size?: SpacingSize;
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({ size = 'md', className }) => {
  const spacerClasses = {
    xs: 'h-2 sm:h-3',
    sm: 'h-3 sm:h-4',
    md: 'h-4 sm:h-6 lg:h-8',
    lg: 'h-6 sm:h-8 lg:h-12',
    xl: 'h-8 sm:h-12 lg:h-16',
    '2xl': 'h-12 sm:h-16 lg:h-24',
  };

  return <div className={cn(spacerClasses[size], className)} />;
};

/**
 * Stack component for consistent vertical spacing between children
 */
export interface StackProps {
  children: React.ReactNode;
  spacing?: SpacingSize;
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  spacing = 'md',
  align = 'stretch',
  className,
}) => {
  const spacingClasses = {
    xs: 'space-y-2 sm:space-y-3',
    sm: 'space-y-3 sm:space-y-4',
    md: 'space-y-4 sm:space-y-6',
    lg: 'space-y-6 sm:space-y-8',
    xl: 'space-y-8 sm:space-y-12',
    '2xl': 'space-y-12 sm:space-y-16',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div className={cn('flex flex-col', spacingClasses[spacing], alignClasses[align], className)}>
      {children}
    </div>
  );
};

/**
 * Inline component for consistent horizontal spacing between children
 */
export interface InlineProps {
  children: React.ReactNode;
  spacing?: SpacingSize;
  align?: 'start' | 'center' | 'end' | 'baseline';
  wrap?: boolean;
  className?: string;
}

export const Inline: React.FC<InlineProps> = ({
  children,
  spacing = 'md',
  align = 'center',
  wrap = true,
  className,
}) => {
  const spacingClasses = {
    xs: 'gap-2 sm:gap-3',
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-12',
    '2xl': 'gap-12 sm:gap-16',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
  };

  return (
    <div
      className={cn(
        'flex',
        wrap && 'flex-wrap',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
};