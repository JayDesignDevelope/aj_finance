import { createContext, useContext, useState, useCallback } from 'react';
import { authenticate } from '../api/db';

const AuthCtx = createContext(null);
const SESSION_KEY = 'dsa_crm_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
  });

  const login = useCallback((email, password) => {
    const u = authenticate(email, password);
    if (u) { setUser(u); localStorage.setItem(SESSION_KEY, JSON.stringify(u)); }
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null); localStorage.removeItem(SESSION_KEY);
  }, []);

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
