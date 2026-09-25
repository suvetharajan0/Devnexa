import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Still checking the cookie — show nothing (or a spinner) rather than
    // flashing the login page for a split second on every refresh.
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-ink-400">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}