import React, { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-line/80 rounded-[var(--radius-3xl)] shadow-card',
        padding && 'p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
