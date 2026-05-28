import { createContext, useContext, useState, useEffect } from 'react';
import { store } from '../utils/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crm_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const users = store.get('crm_users');
    const found = users.find(u => u.email === email && u.password === password && u.status === 'Active');
    if (!found) return { success: false, error: 'Invalid credentials or account inactive' };
    const session = { id: found.id, name: found.name, email: found.email, role: found.role };
    localStorage.setItem('crm_auth', JSON.stringify(session));
    setUser(session);
    return { success: true, role: found.role };
  };

  const logout = () => {
    localStorage.removeItem('crm_auth');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
