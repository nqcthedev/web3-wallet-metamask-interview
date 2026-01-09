import { useState, useEffect } from 'react';

export type Theme = 'system' | 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

/**
 * Get initial theme from localStorage or default to "system"
 */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

/**
 * Compute effective dark boolean from theme
 * - "dark" => true
 * - "light" => false
 * - "system" => matchMedia('(prefers-color-scheme: dark)').matches
 */
function getIsDark(theme: Theme): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  // theme === 'system'
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Theme hook - Manage dark/light/system theme with localStorage persistence
 * 
 * Applies theme by toggling "dark" class on document.documentElement.
 * Listens to system preference changes only when theme === "system".
 */
export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
} {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDark = getIsDark(theme);
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  // Listen to system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const isDark = getIsDark('system');
      document.documentElement.classList.toggle('dark', isDark);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  };

  return { theme, setTheme };
}
