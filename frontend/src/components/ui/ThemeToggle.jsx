import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';


export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();


  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="rounded-full p-2 text-ink-600 hover:bg-surface-muted"
    >
      {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}