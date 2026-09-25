import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LandingPage from '../../pages/LandingPage.jsx';


// The "/" route needs different behavior per visitor: logged-in users
// should skip straight to their Dashboard, logged-out visitors should
// see the public marketing page — this decides which, once we know.
export function HomeRoute() {
  const { isAuthenticated, loading } = useAuth();


  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}
