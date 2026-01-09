import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'error' | 'na';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  secondary: 'border-transparent bg-slate-500/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400',
  destructive: 'border-transparent bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  outline: 'text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-600',
  success: 'border-transparent bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  warning: 'border-transparent bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  error: 'border-transparent bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  na: 'border-transparent bg-slate-500/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
