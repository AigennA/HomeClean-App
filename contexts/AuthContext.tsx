import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { api, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedUser = await storage.get('user');
      const storedToken = await storage.get('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
      setLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    const result = await api.login(email, password);
    await storage.set('user', JSON.stringify(result.user));
    await storage.set('token', result.token);
    setUser(result.user);
    setToken(result.token);
  }

  async function register(name: string, email: string, phone: string, password: string) {
    const result = await api.register(name, email, phone, password);
    await storage.set('user', JSON.stringify(result.user));
    await storage.set('token', result.token);
    setUser(result.user);
    setToken(result.token);
  }

  async function logout() {
    await storage.remove('user');
    await storage.remove('token');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
