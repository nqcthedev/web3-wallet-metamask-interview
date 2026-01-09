import { type Theme } from '@/hooks';
import { ThemeIcon } from './ThemeIcon';

interface ThemeMenuProps {
  themes: { value: Theme; label: string }[];
  currentTheme: Theme;
  onSelect: (theme: Theme) => void;
}

/**
 * Theme Menu - UI only
 * Dropdown menu for theme selection
 */
export function ThemeMenu({ themes, currentTheme, onSelect }: ThemeMenuProps) {
  return (
    <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-700/50 dark:border-slate-700/50 border-slate-300/50 bg-slate-800/95 dark:bg-slate-800/95 bg-white/95 backdrop-blur-xl shadow-lg z-50 overflow-hidden">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => onSelect(t.value)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            currentTheme === t.value
              ? 'bg-blue-500/20 dark:bg-blue-500/20 bg-blue-500/10 text-blue-300 dark:text-blue-300 text-blue-700'
              : 'text-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 hover:bg-slate-100/50'
          }`}
        >
          <span className="text-slate-300 dark:text-slate-300 text-slate-700">
            <ThemeIcon theme={t.value} />
          </span>
          <span className="font-medium">{t.label}</span>
          {currentTheme === t.value && (
            <svg
              className="w-4 h-4 ml-auto text-blue-400 dark:text-blue-400 text-blue-600"
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
  );
}
