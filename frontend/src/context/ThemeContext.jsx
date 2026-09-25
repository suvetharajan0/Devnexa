import { createContext, useContext, useEffect, useState } from 'react';


const ThemeContext = createContext(null);


function getInitialTheme() {
  const stored = localStorage.getItem('devnexa-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}


export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);


  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('devnexa-theme', theme);
  }, [theme]);


  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}


export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside a <ThemeProvider>');
  return ctx;
}
