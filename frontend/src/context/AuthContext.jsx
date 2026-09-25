import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, logoutUser, registerUser, fetchCurrentUser } from '../api/auth.js';


function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing cookie

  // On first load, ask the backend "who am I?" using whatever cookie the browser already has
  useEffect(() => {
    fetchCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

 async function login(credentials) {
    const res = await loginUser(credentials);
    setUser(res.data);
    requestNotificationPermission();
    return res.data;
  }

   async function register(payload) {
    const res = await registerUser(payload);
    setUser(res.data);
    requestNotificationPermission();
    return res.data;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  function refreshUser(updatedUser) {
    setUser(updatedUser);
  }

  const value = { user, loading, login, register, logout, refreshUser, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook so components just do: const { user, login } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an <AuthProvider>');
  return ctx;
}