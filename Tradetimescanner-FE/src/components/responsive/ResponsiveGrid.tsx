import React from 'react';
import { cn } from '../../lib/utils';

export type GridGap = 'sm' | 'md' | 'lg' | 'xl';

export interface ResponsiveGridColumns {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface ResponsiveGridProps {
  children: React.ReactNode;
  columns: ResponsiveGridColumns;
  gap?: GridGap;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Responsive grid system with mobile-first approach
 * Automatically adjusts column count based on screen size
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns,
  gap = 'md',
  className,
  as: Component = 'div',
}) => {
  // Gap classes
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  // Generate responsive grid column classes
  const getGridCols = (count: number): string => {
    const gridColsMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
    };
    return gridColsMap[count] || 'grid-cols-1';
  };

  const gridClasses = cn(
    'grid',
    getGridCols(columns.mobile), // Mobile first (base)
    `md:${getGridCols(columns.tablet)}`, // Tablet
    `lg:${getGridCols(columns.desktop)}`, // Desktop
    gapClasses[gap],
    className
  );

  return (
    <Component className={gridClasses}>
      {children}
    </Component>
  );
};

/**
 * Simple responsive grid with predefined responsive patterns
 */
export interface SimpleGridProps {
  children: React.ReactNode;
  pattern?: 'auto' | 'cards' | 'list' | 'masonry';
  gap?: GridGap;
  className?: string;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({
  children,
  pattern = 'auto',
  gap = 'md',
  className,
}) => {
  const patterns: Record<string, ResponsiveGridColumns> = {
    auto: { mobile: 1, tablet: 2, desktop: 3 },
    cards: { mobile: 1, tablet: 2, desktop: 4 },
    list: { mobile: 1, tablet: 1, desktop: 2 },
    masonry: { mobile: 1, tablet: 2, desktop: 3 },
  };

  return (
    <ResponsiveGrid
      columns={patterns[pattern]}
      gap={gap}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
};