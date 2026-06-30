'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('access_token');
        document.cookie = 'access_token=; Max-Age=0; path=/';
      })
      .finally(() => setIsLoading(false));
  }, []);

  const storeToken = (token: string) => {
    localStorage.setItem('access_token', token);
    // Also set as cookie so Next.js middleware can read it
    document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    storeToken(res.accessToken);
    setUser(res.user);
  }, []);

  const signup = useCallback(async (email: string, name: string, password: string) => {
    const res = await authApi.signup({ email, name, password });
    storeToken(res.accessToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    document.cookie = 'access_token=; Max-Age=0; path=/';
    setUser(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAdmin: user?.role === 'admin', login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
