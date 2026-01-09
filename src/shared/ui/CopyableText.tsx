import { useState, type MouseEvent, type KeyboardEvent } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';

interface CopyableTextProps {
  text: string;
  displayText?: string;
  label?: string;
  className?: string;
}

/**
 * CopyableText - Reusable component cho copy address UX (Web3-style)
 * 
 * UX IMPROVEMENTS:
 * - Tooltip hiển thị "Copy" hoặc "Copy {label}" khi hover
 * - Toast feedback khi copy success/error
 * - Pointer cursor trên toàn bộ row để indicate clickable
 * - Keyboard accessible: Enter/Space triggers copy
 * - Subtle hover feedback với background và opacity changes
 * - Icon size >= 18px để dễ click
 * - Focus ring cho accessibility
 */
export function CopyableText({ text, displayText, label, className }: CopyableTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async (e?: MouseEvent | KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      await navigator.clipboard.writeText(text);
      const toastMessage = label ? `Copied ${label}` : 'Copied';
      toast.success(toastMessage);
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopy(e);
    }
  };

  const tooltipContent = label ? `Copy ${label}` : 'Copy';
  const shownText = displayText ?? text;

  return (
    <Tooltip content={tooltipContent}>
      <button
        type="button"
        className={cn(
          'flex items-center gap-2 px-2 py-1 rounded-md transition-all cursor-pointer w-full text-left',
          'hover:bg-slate-800/50 hover:border-slate-700/50',
          'focus:ring-2 focus:ring-blue-500/50 focus:outline-none',
          isHovered && 'bg-slate-800/30',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        aria-label={tooltipContent}
      >
        <span className="text-sm font-mono text-slate-800 dark:text-slate-300 select-text min-w-0 truncate flex-1">{shownText}</span>
        <span className="p-1 hover:bg-slate-700/50 rounded transition-colors select-none shrink-0 pointer-events-none">
          <svg
            className="w-[18px] h-[18px] text-slate-400 hover:text-slate-200 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </span>
      </button>
    </Tooltip>
  );
}
