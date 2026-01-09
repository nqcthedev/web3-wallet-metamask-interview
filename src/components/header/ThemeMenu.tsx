import { useState, useRef } from 'react';
import { useTheme, type Theme } from '@/hooks';
import { useClickOutside } from './useClickOutside';

/**
 * Theme Menu - Theme icon button + dropdown (system/light/dark)
 * Handles theme selection dropdown
 */
export function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useClickOutside(themeMenuRef, () => setThemeMenuOpen(false), themeMenuOpen);

  // Theme icons
  const themeIcons = {
    light: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    dark: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    system: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  };

  const currentThemeIcon = themeIcons[theme] || themeIcons.system;

  return (
    <div className="relative" ref={themeMenuRef}>
      <button
        onClick={() => setThemeMenuOpen(!themeMenuOpen)}
        aria-label="Toggle theme"
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors shrink-0"
      >
        {currentThemeIcon}
      </button>

      {/* Theme Dropdown Menu */}
      {themeMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/95 backdrop-blur-xl shadow-lg z-50 overflow-hidden">
          {(['system', 'light', 'dark'] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTheme(t);
                setThemeMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                theme === t
                  ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              <span>{themeIcons[t]}</span>
              <span className="font-medium capitalize">{t}</span>
              {theme === t && (
                <svg
                  className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
