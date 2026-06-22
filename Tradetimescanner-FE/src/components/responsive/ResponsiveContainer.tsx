import React from 'react';
import { cn } from '../../lib/utils';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: ContainerSize;
  padding?: ContainerPadding;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Responsive container component with adaptive max-widths and padding
 * Provides consistent container behavior across all screen sizes
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = 'md',
  className,
  as: Component = 'div',
}) => {
  // Max-width classes based on container size
  const maxWidthClasses = {
    sm: 'max-w-screen-sm', // 640px
    md: 'max-w-screen-md', // 768px
    lg: 'max-w-screen-lg', // 1024px
    xl: 'max-w-screen-xl', // 1280px
    full: 'max-w-full',
  };

  // Responsive padding classes
  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-4 sm:px-6 lg:px-8 xl:px-12',
  };

  const containerClasses = cn(
    'mx-auto w-full',
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    className
  );

  return (
    <Component className={containerClasses}>
      {children}
    </Component>
  );
};