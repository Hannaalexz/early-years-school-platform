import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, DemoAccount } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  demoAccounts: DemoAccount[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
  hasPermission: (...permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ey_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ey_auth_token'));
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load demo accounts for 1-click testing
  useEffect(() => {
    api.getDemoAccounts().then((res) => {
      if (res.success && res.data) {
        setDemoAccounts(res.data);
      }
    });
  }, []);

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        const res = await api.getCurrentUser();
        if (res.success && res.data) {
          setUser(res.data);
          localStorage.setItem('ey_auth_user', JSON.stringify(res.data));
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('ey_auth_token');
          localStorage.removeItem('ey_auth_user');
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth_logout', handleLogout);
    return () => window.removeEventListener('auth_logout', handleLogout);
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await api.login(email, password);
    setLoading(false);

    if (res.success && res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('ey_auth_token', res.data.token);
      localStorage.setItem('ey_auth_user', JSON.stringify(res.data.user));
      return { success: true };
    }

    return {
      success: false,
      message: res.message || 'Login failed. Please check your credentials.',
    };
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('ey_auth_token');
    localStorage.removeItem('ey_auth_user');
  };

  const switchDemoRole = async (targetRole: UserRole) => {
    const account = demoAccounts.find((a) => a.role_id === targetRole);
    if (!account) return;

    await login(account.email, account.default_password);
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return roles.includes(user.role);
  };

  const hasPermission = (...permissions: string[]): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.permissions?.includes('system:all')) return true;
    return permissions.every((p) => user.permissions?.includes(p));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        demoAccounts,
        loading,
        login,
        logout,
        switchDemoRole,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
