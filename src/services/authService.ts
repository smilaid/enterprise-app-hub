import { logger, LogCategory } from '../utils/logger';
import authData from '../mock/authData.json';

// Feature flag for authentication
const USE_KEYCLOAK_AUTH = import.meta.env.VITE_USE_KEYCLOAK_AUTH === 'true';
const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'master';
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'portal-app';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  groups?: string[];
  accessToken?: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  user?: AuthUser;
  isLoading: boolean;
  error?: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private isInitialized = false;

  /**
   * Initialize the authentication service
   */
  async initialize(): Promise<AuthStatus> {
    logger.info(LogCategory.AUTH, 'Initializing authentication service', { useKeycloak: USE_KEYCLOAK_AUTH });
    
    if (this.isInitialized) {
      return this.getAuthStatus();
    }

    try {
      if (USE_KEYCLOAK_AUTH) {
        return await this.initializeKeycloak();
      } else {
        return await this.initializeMock();
      }
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Failed to initialize authentication', error);
      return {
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication initialization failed'
      };
    } finally {
      this.isInitialized = true;
    }
  }

  /**
   * Initialize Keycloak authentication
   */
  private async initializeKeycloak(): Promise<AuthStatus> {
    logger.debug(LogCategory.AUTH, 'Initializing Keycloak authentication');
    
    try {
      // Check for Keycloak session cookie
      const keycloakCookie = this.getKeycloakSessionCookie();
      
      if (!keycloakCookie) {
        logger.info(LogCategory.AUTH, 'No Keycloak session found');
        return { isAuthenticated: false, isLoading: false };
      }

      // Validate session and get user info
      const user = await this.validateKeycloakSession();
      
      if (user) {
        this.currentUser = user;
        logger.info(LogCategory.AUTH, 'Keycloak authentication successful', { userId: user.id });
        return { isAuthenticated: true, user, isLoading: false };
      } else {
        logger.warn(LogCategory.AUTH, 'Keycloak session validation failed');
        return { isAuthenticated: false, isLoading: false };
      }
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Keycloak initialization error', error);
      throw error;
    }
  }

  /**
   * Initialize mock authentication for testing
   */
  private async initializeMock(): Promise<AuthStatus> {
    logger.debug(LogCategory.AUTH, 'Initializing mock authentication');
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check for demo login state
    const isLoggedIn = localStorage.getItem('demo_auth_token');
    
    if (isLoggedIn) {
      // Get the selected mock user ID from localStorage
      const mockUserId = localStorage.getItem('mockUserId');
      let mockUser = authData.users.find(user => user.id === mockUserId);
      
      // Fallback to first user if no user is selected
      if (!mockUser) {
        mockUser = authData.users[0];
      }
      
      const authUser: AuthUser = {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        displayName: mockUser.displayName,
        role: mockUser.role,
        groups: mockUser.groups
      };
      
      this.currentUser = authUser;
      logger.info(LogCategory.AUTH, 'Mock authentication successful', { userId: authUser.id });
      return { isAuthenticated: true, user: authUser, isLoading: false };
    }
    
    return { isAuthenticated: false, isLoading: false };
  }

  /**
   * Get Keycloak session cookie
   */
  private getKeycloakSessionCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'KEYCLOAK_SESSION' || name === `KEYCLOAK_SESSION_${KEYCLOAK_REALM}`) {
        return value;
      }
    }
    return null;
  }

  /**
   * Validate Keycloak session and get user info
   */
  private async validateKeycloakSession(): Promise<AuthUser | null> {
    try {
      const response = await fetch('/auth/me', {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          logger.info(LogCategory.AUTH, 'User not authenticated');
          return null;
        }
        throw new Error(`Auth validation failed: ${response.status}`);
      }

      const userData = await response.json();
      
      return {
        id: userData.sub || userData.id,
        username: userData.preferred_username || userData.username,
        email: userData.email,
        displayName: userData.name || userData.displayName,
        role: userData.role || 'user',
        groups: userData.groups || [],
        accessToken: userData.access_token
      };
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Failed to validate Keycloak session', error);
      return null;
    }
  }

  /**
   * Login (redirect to Keycloak or demo login)
   */
  async login(): Promise<void> {
    logger.info(LogCategory.AUTH, 'Login initiated');
    
    if (USE_KEYCLOAK_AUTH) {
      // Redirect to Keycloak login
      const loginUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${KEYCLOAK_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=openid`;
      window.location.href = loginUrl;
    } else {
      // Demo login
      localStorage.setItem('demo_auth_token', 'demo-token');
      window.location.reload();
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    logger.info(LogCategory.AUTH, 'Logout initiated', { userId: this.currentUser?.id });
    
    this.currentUser = null;
    
    if (USE_KEYCLOAK_AUTH) {
      // Clear any local storage
      localStorage.clear();
      
      // Redirect to Keycloak logout
      const logoutUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(window.location.origin)}`;
      window.location.href = logoutUrl;
    } else {
      // Demo logout - only remove auth token, keep user selection
      localStorage.removeItem('demo_auth_token');
      localStorage.removeItem('hasVisitedPortal');
      window.location.reload();
    }
  }

  /**
   * Get current authentication status
   */
  getAuthStatus(): AuthStatus {
    return {
      isAuthenticated: !!this.currentUser,
      user: this.currentUser || undefined,
      isLoading: false
    };
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.currentUser?.role === role || this.currentUser?.groups?.includes(role) || false;
  }

  /**
   * Refresh user info
   */
  async refreshUser(): Promise<AuthUser | null> {
    if (!USE_KEYCLOAK_AUTH) {
      return this.currentUser;
    }

    try {
      const user = await this.validateKeycloakSession();
      this.currentUser = user;
      return user;
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Failed to refresh user', error);
      return null;
    }
  }
}

export const authService = new AuthService();
