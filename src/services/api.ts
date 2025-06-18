import { mockApiService } from '../mock/mockApiService';
import { logger, LogCategory } from '../utils/logger';

// Use environment variable to determine if we should use mock data
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'; // Default to true unless explicitly set to false

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: string;
}

export interface UseCaseSummary {
  id: string;
  name: string;
  description: string;
  status: string;
  scope: string;
  ownerId: string;
  guideUrl?: string;
  icon?: string;
  accessUrl?: string;
}

export interface ConsumptionRecord {
  id: string;
  userId: string;
  useCaseId: string;
  tokensUsed: number;
  costEur: number;
  carbonKg: number;
  occurredAt: string;
}

export interface UserActivityMetrics {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  carbonImpact: number;
  period: 'current_month';
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    logger.debug(LogCategory.API, 'Getting auth headers', { hasToken: !!token });
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async fetchUserProfile(): Promise<UserProfile> {
    logger.info(LogCategory.API, 'Fetching user profile');
    
    try {
      if (USE_MOCK_API) {
        logger.debug(LogCategory.API, 'Using mock API for user profile');
        const result = await mockApiService.fetchUserProfile();
        logger.info(LogCategory.API, 'User profile fetched successfully', { userId: result.id });
        return result;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        logger.error(LogCategory.API, 'Failed to fetch user profile', { status: response.status });
        throw new Error('Failed to fetch user profile');
      }
      
      const result = await response.json();
      logger.info(LogCategory.API, 'User profile fetched successfully', { userId: result.id });
      return result;
    } catch (error) {
      logger.error(LogCategory.API, 'Error fetching user profile', error);
      throw error;
    }
  }

  async fetchUseCases(params?: {
    status?: string;
    owner?: string;
    search?: string;
    scope?: string;
  }): Promise<UseCaseSummary[]> {
    logger.info(LogCategory.API, 'Fetching use cases', params);
    
    try {
      if (USE_MOCK_API) {
        logger.debug(LogCategory.API, 'Using mock API for use cases');
        const result = await mockApiService.fetchUseCases(params);
        logger.info(LogCategory.API, 'Use cases fetched successfully', { count: result.length });
        return result;
      }

      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value);
        });
      }

      const response = await fetch(`${API_BASE_URL}/use-cases?${searchParams}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        logger.error(LogCategory.API, 'Failed to fetch use cases', { status: response.status });
        throw new Error('Failed to fetch use cases');
      }
      
      const result = await response.json();
      logger.info(LogCategory.API, 'Use cases fetched successfully', { count: result.length });
      return result;
    } catch (error) {
      logger.error(LogCategory.API, 'Error fetching use cases', error);
      throw error;
    }
  }

  async logUseCaseAccess(useCaseId: string, userId: string): Promise<ConsumptionRecord> {
    logger.info(LogCategory.USER_ACTION, 'Logging use case access', { useCaseId, userId });
    
    try {
      if (USE_MOCK_API) {
        logger.debug(LogCategory.API, 'Using mock API for use case access logging');
        const result = await mockApiService.logUseCaseAccess(useCaseId, userId);
        logger.info(LogCategory.USER_ACTION, 'Use case access logged successfully', { useCaseId, userId });
        return result;
      }

      const response = await fetch(`${API_BASE_URL}/use-cases/${useCaseId}/access`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        logger.error(LogCategory.API, 'Failed to log use case access', { status: response.status, useCaseId });
        throw new Error('Failed to log use case access');
      }
      
      const result = await response.json();
      logger.info(LogCategory.USER_ACTION, 'Use case access logged successfully', { useCaseId, userId });
      return result;
    } catch (error) {
      logger.error(LogCategory.API, 'Error logging use case access', error);
      throw error;
    }
  }

  async addToFavorites(userId: string, useCaseId: string): Promise<void> {
    logger.info(LogCategory.USER_ACTION, 'Adding to favorites', { userId, useCaseId });
    
    try {
      if (USE_MOCK_API) {
        await mockApiService.addToFavorites(userId, useCaseId);
        logger.info(LogCategory.USER_ACTION, 'Added to favorites successfully', { userId, useCaseId });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ useCaseId }),
      });
      
      if (!response.ok) {
        logger.error(LogCategory.API, 'Failed to add to favorites', { status: response.status });
        throw new Error('Failed to add to favorites');
      }
      
      logger.info(LogCategory.USER_ACTION, 'Added to favorites successfully', { userId, useCaseId });
    } catch (error) {
      logger.error(LogCategory.API, 'Error adding to favorites', error);
      throw error;
    }
  }

  async getFavorites(userId: string): Promise<string[]> {
    logger.debug(LogCategory.API, 'Fetching favorites', { userId });
    
    try {
      if (USE_MOCK_API) {
        const result = await mockApiService.getFavorites(userId);
        logger.debug(LogCategory.API, 'Favorites fetched successfully', { userId, count: result.length });
        return result;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        logger.error(LogCategory.API, 'Failed to fetch favorites', { status: response.status });
        throw new Error('Failed to fetch favorites');
      }
      
      const result = await response.json();
      logger.debug(LogCategory.API, 'Favorites fetched successfully', { userId, count: result.length });
      return result;
    } catch (error) {
      logger.error(LogCategory.API, 'Error fetching favorites', error);
      throw error;
    }
  }

  async removeFavorite(userId: string, useCaseId: string): Promise<void> {
    logger.info(LogCategory.USER_ACTION, 'Removing from favorites', { userId, useCaseId });
    
    try {
      if (USE_MOCK_API) {
        await mockApiService.removeFavorite(userId, useCaseId);
        logger.info(LogCategory.USER_ACTION, 'Removed from favorites successfully', { userId, useCaseId });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${useCaseId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        logger.error(LogCategory.API, 'Failed to remove favorite', { status: response.status });
        throw new Error('Failed to remove favorite');
      }
      
      logger.info(LogCategory.USER_ACTION, 'Removed from favorites successfully', { userId, useCaseId });
    } catch (error) {
      logger.error(LogCategory.API, 'Error removing favorite', error);
      throw error;
    }
  }

  async getRecents(userId: string): Promise<Array<{ useCaseId: string; lastAccessed: string }>> {
    logger.debug(LogCategory.API, 'Fetching recents', { userId });
    
    try {
      if (USE_MOCK_API) {
        const result = await mockApiService.getRecents(userId);
        logger.debug(LogCategory.API, 'Recents fetched successfully', { userId, count: result.length });
        return result;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/recents`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        logger.error(LogCategory.API, 'Failed to fetch recents', { status: response.status });
        throw new Error('Failed to fetch recents');
      }
      
      const result = await response.json();
      logger.debug(LogCategory.API, 'Recents fetched successfully', { userId, count: result.length });
      return result;
    } catch (error) {
      logger.error(LogCategory.API, 'Error fetching recents', error);
      throw error;
    }
  }

  async getConsumption(params?: {
    userId?: string;
    useCaseId?: string;
    from?: string;
    to?: string;
  }): Promise<ConsumptionRecord[]> {
    logger.info(LogCategory.API, 'Fetching consumption data', params);
    
    try {
      if (USE_MOCK_API) {
        const result = await mockApiService.getConsumption(params);
        logger.info(LogCategory.API, 'Consumption data fetched successfully', { count: result.length });
        return result;
      }

      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value);
        });
      }

      const response = await fetch(`${API_BASE_URL}/consumption?${searchParams}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        logger.error(LogCategory.API, 'Failed to fetch consumption data', { status: response.status });
        throw new Error('Failed to fetch consumption data');
      }
      
      const result = await response.json();
      logger.info(LogCategory.API, 'Consumption data fetched successfully', { count: result.length });
      return result;
    } catch (error) {
      logger.error(LogCategory.API, 'Error fetching consumption data', error);
      throw error;
    }
  }

  async getUserActivityMetrics(userId: string): Promise<UserActivityMetrics> {
    logger.info(LogCategory.API, 'Fetching user activity metrics', { userId });
    
    try {
      if (USE_MOCK_API) {
        logger.debug(LogCategory.API, 'Using mock API for user activity metrics');
        const result = await mockApiService.getUserActivityMetrics(userId);
        logger.info(LogCategory.API, 'User activity metrics fetched successfully', { userId });
        return result;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/activity-metrics`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        logger.error(LogCategory.API, 'Failed to fetch user activity metrics', { status: response.status });
        throw new Error('Failed to fetch user activity metrics');
      }
      
      const result = await response.json();
      logger.info(LogCategory.API, 'User activity metrics fetched successfully', { userId });
      return result;
    } catch (error) {
      logger.error(LogCategory.API, 'Error fetching user activity metrics', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
