import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border border-slate-200 dark:border-slate-700/50 rounded-lg overflow-hidden bg-white dark:bg-slate-900/50', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/30 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</span>
        <svg
          className={cn('w-5 h-5 text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700/50">
          {children}
        </div>
      )}
    </div>
  );
}
