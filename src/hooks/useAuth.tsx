
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService, AuthStatus, AuthUser } from '../services/authService';
import { logger, LogCategory } from '../utils/logger';

interface AuthContextType extends AuthStatus {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      logger.debug(LogCategory.AUTH, 'Initializing auth provider');
      const status = await authService.initialize();
      setAuthStatus(status);
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Auth provider initialization failed', error);
      setAuthStatus({
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication failed'
      });
    }
  };

  const login = async () => {
    setAuthStatus(prev => ({ ...prev, isLoading: true }));
    await authService.login();
  };

  const logout = async () => {
    setAuthStatus(prev => ({ ...prev, isLoading: true }));
    await authService.logout();
  };

  const refreshUser = async () => {
    try {
      const user = await authService.refreshUser();
      setAuthStatus(prev => ({
        ...prev,
        user: user || undefined,
        isAuthenticated: !!user
      }));
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Failed to refresh user', error);
    }
  };

  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const contextValue: AuthContextType = {
    ...authStatus,
    login,
    logout,
    refreshUser,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
