import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, type User, type Organization } from '@/lib/api';
import { STORAGE_KEYS } from '@/config';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserData = async () => {
    try {
      const [userData, orgData] = await Promise.all([
        api.getMe(),
        api.getOrganization(),
      ]);
      setUser(userData);
      setOrganization(orgData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access_token);
    await loadUserData();
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.ORG_DATA);
    setUser(null);
    setOrganization(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
