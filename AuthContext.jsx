import { createContext, useContext, useState } from 'react';
import { db } from '../utils/storage';

const AuthCtx = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);

const ADMIN = { name: 'Mission Admin', email: 'admin@nasa.gov', password: 'Admin@123', role: 'admin', conditions: [] };

const readSession = () => {
  try { return JSON.parse(sessionStorage.getItem('session')) ?? db.get('session', null); }
  catch { return db.get('session', null); }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const allUsers = () => [ADMIN, ...db.get('users', [])];

  const startSession = (u, remember) => {
    localStorage.removeItem('session'); sessionStorage.removeItem('session');
    (remember ? localStorage : sessionStorage).setItem('session', JSON.stringify(u));
    setUser(u);
  };

  const register = (data, remember = true) => {
    const email = data.email.trim().toLowerCase();
    if (allUsers().some((u) => u.email.toLowerCase() === email)) return { ok: false, error: 'This email is already registered.' };
    if (data.password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
    const newUser = { ...data, email, role: 'user' };
    db.set('users', [...db.get('users', []), newUser]);
    startSession(newUser, remember);
    return { ok: true, role: 'user' };
  };

  const login = (email, password, remember = true) => {
    const e = email.trim().toLowerCase();
    const u = allUsers().find((x) => x.email.toLowerCase() === e && x.password === password);
    if (!u) return { ok: false, error: 'Invalid email or password.' };
    startSession(u, remember);
    return { ok: true, role: u.role };
  };

  const logout = () => {
    localStorage.removeItem('session'); sessionStorage.removeItem('session');
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, register, login, logout, allUsers }}>{children}</AuthCtx.Provider>;
}
