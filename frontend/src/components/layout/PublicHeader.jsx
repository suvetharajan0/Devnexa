import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BRAND_NAME } from '../../lib/constants.js';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';


const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#projects', label: 'Projects' },
];


export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();


  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
          <img src="/logo.png" alt={BRAND_NAME} className="size-8" />
          <span className="text-base font-bold text-ink-900">{BRAND_NAME}</span>
        </Link>


        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-ink-600 hover:text-ink-900">
              {link.label}
            </a>
          ))}
        </nav>


        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-600 hover:text-ink-900">
                Log in
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>


        <button onClick={() => setMobileOpen((v) => !v)} className="text-ink-600 md:hidden">
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>


      {mobileOpen && (
        <div className="border-t border-border-subtle bg-surface-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-ink-600"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-border-subtle pt-3">
              {isAuthenticated ? (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink-600">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink-600">
                  Log in
                </Link>
              )}
              <ThemeToggle />
            </div>
            {!isAuthenticated && (
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}