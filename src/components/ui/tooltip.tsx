import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ children, content, side = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded-md shadow-lg border border-slate-700 whitespace-nowrap pointer-events-none',
            sideClasses[side],
            className
          )}
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 bg-slate-900 border-slate-700 rotate-45',
              side === 'top' && 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-r border-b',
              side === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-l border-t',
              side === 'left' && 'left-full top-1/2 -translate-y-1/2 translate-x-1/2 border-r border-t',
              side === 'right' && 'right-full top-1/2 -translate-y-1/2 -translate-x-1/2 border-l border-b'
            )}
          />
        </div>
      )}
    </div>
  );
}
