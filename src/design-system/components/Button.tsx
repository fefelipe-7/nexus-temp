import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'cursor-pointer group whitespace-nowrap focus-visible:outline-hidden inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-[color,box-shadow,transform] duration-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white hover:bg-accent/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'bg-background text-accent-foreground border border-input hover:bg-accent/10',
        ghost: 'text-accent-foreground hover:bg-accent/10',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        inverse: '',
      },
      size: {
        lg: 'h-10 rounded-lg px-4 text-sm gap-1.5 [&_svg]:size-4',
        md: 'h-8.5 rounded-md px-3 gap-1.5 text-[0.8125rem] [&_svg]:size-4',
        sm: 'h-7 rounded-md px-2.5 gap-1.25 text-xs [&_svg]:size-3.5',
        icon: 'size-8.5 rounded-md [&_svg]:size-4 shrink-0',
      },
      mode: {
        default: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        icon: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      },
      shape: {
        default: '',
        circle: 'rounded-full',
      },
    },
    compoundVariants: [
      { size: 'sm', mode: 'icon', className: 'w-7 h-7 p-0 [&_svg]:size-3.5' },
      { size: 'md', mode: 'icon', className: 'w-8.5 h-8.5 p-0' },
      { size: 'icon', className: 'w-8.5 h-8.5 p-0' },
      { size: 'lg', mode: 'icon', className: 'w-10 h-10 p-0' },
    ],
    defaultVariants: {
      variant: 'primary',
      mode: 'default',
      size: 'md',
      shape: 'default',
    },
  },
);

export function Button({
  className,
  selected,
  variant,
  shape,
  mode,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    selected?: boolean;
    asChild?: boolean;
  }) {
  const Comp = asChild ? (SlotPrimitive as unknown as React.ElementType) : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, mode, className }))}
      {...(selected && { 'data-state': 'open' })}
      {...props}
    />
  );
}
