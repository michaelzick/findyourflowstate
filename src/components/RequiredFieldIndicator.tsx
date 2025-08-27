import React from 'react';

interface RequiredFieldIndicatorProps {
  required?: boolean;
  className?: string;
}

export function RequiredFieldIndicator({ required = true, className = "" }: RequiredFieldIndicatorProps) {
  if (!required) return null;
  
  return (
    <span className={`text-red-500 ml-1 ${className}`} aria-label="Required field">
      *
    </span>
  );
}