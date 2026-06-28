import React, { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl shadow-card',
        padding && 'p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
