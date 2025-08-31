import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Memoized Card component to prevent unnecessary re-renders
 */
export const OptimizedCard = memo<OptimizedCardProps>(({ 
  className, 
  children, 
  ...props 
}) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

OptimizedCard.displayName = "OptimizedCard";