import React, { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/auth';

interface AuthUser {
  username: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('ims_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username: string, password: string) => {
    const res = await loginRequest(username, password);
    const nextUser = { username: res.username, role: res.role };
    localStorage.setItem('ims_token', res.token);
    localStorage.setItem('ims_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('ims_token');
    localStorage.removeItem('ims_user');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
