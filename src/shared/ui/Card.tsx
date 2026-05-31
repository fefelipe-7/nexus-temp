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
        'bg-white border border-[#E3E0D8]/80 rounded-[24px]',
        padding && 'p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
