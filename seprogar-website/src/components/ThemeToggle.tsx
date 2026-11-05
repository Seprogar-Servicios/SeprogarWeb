import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle({
  className = '',
  lightOnDark = false,
}: {
  className?: string;
  /** Cuando el header está sobre el hero oscuro */
  lightOnDark?: boolean;
}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
        lightOnDark
          ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
          : 'border-theme bg-surface text-foreground hover:text-[#F37021] hover:border-[#F37021]/40'
      } ${className}`}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
