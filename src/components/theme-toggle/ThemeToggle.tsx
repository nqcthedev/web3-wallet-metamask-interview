import { useState, useRef, useCallback } from 'react';
import { useTheme, type Theme } from '@/hooks';
import { ThemeIcon } from './ThemeIcon';
import { ThemeMenu } from './ThemeMenu';
import { useClickOutside } from '../header/useClickOutside';

/**
 * Theme Toggle Component - Compact dropdown for theme selection
 * 
 * Features:
 * - Desktop: Shows current theme with dropdown menu
 * - Mobile: Icon-only button with dropdown
 * - Icons: Sun (light), Moon (dark), Monitor (system)
 * - Active option highlighted
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside - use shared hook
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(dropdownRef, handleClose, isOpen);

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];

  const handleSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/50 dark:border-slate-700/50 border-slate-300/50 bg-slate-800/50 dark:bg-slate-800/50 bg-white/50 text-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 hover:bg-slate-100/50 transition-colors shrink-0 h-9 sm:h-10"
      >
        {/* Icon - Always visible */}
        <span className="text-slate-300 dark:text-slate-300 text-slate-700">
          <ThemeIcon theme={currentTheme.value} />
        </span>
        {/* Label - Hidden on mobile, visible on desktop */}
        <span className="hidden sm:inline text-sm font-medium">{currentTheme.label}</span>
        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-slate-400 dark:text-slate-400 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ThemeMenu themes={themes} currentTheme={theme} onSelect={handleSelect} />
      )}
    </div>
  );
}
