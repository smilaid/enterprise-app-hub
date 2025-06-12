
import { mockApiService } from '../mock/mockApiService';

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

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async fetchUserProfile(): Promise<UserProfile> {
    if (USE_MOCK_API) {
      return mockApiService.fetchUserProfile();
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return response.json();
  }

  async fetchUseCases(params?: {
    status?: string;
    owner?: string;
    search?: string;
    scope?: string;
  }): Promise<UseCaseSummary[]> {
    if (USE_MOCK_API) {
      return mockApiService.fetchUseCases(params);
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
      throw new Error('Failed to fetch use cases');
    }
    
    return response.json();
  }

  async logUseCaseAccess(useCaseId: string, userId: string): Promise<ConsumptionRecord> {
    if (USE_MOCK_API) {
      return mockApiService.logUseCaseAccess(useCaseId, userId);
    }

    const response = await fetch(`${API_BASE_URL}/use-cases/${useCaseId}/access`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to log use case access');
    }
    
    return response.json();
  }

  async addToFavorites(userId: string, useCaseId: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockApiService.addToFavorites(userId, useCaseId);
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ useCaseId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to favorites');
    }
  }

  async getFavorites(userId: string): Promise<string[]> {
    if (USE_MOCK_API) {
      return mockApiService.getFavorites(userId);
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }
    
    return response.json();
  }

  async removeFavorite(userId: string, useCaseId: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockApiService.removeFavorite(userId, useCaseId);
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${useCaseId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }
  }

  async getRecents(userId: string): Promise<Array<{ useCaseId: string; lastAccessed: string }>> {
    if (USE_MOCK_API) {
      return mockApiService.getRecents(userId);
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/recents`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recents');
    }
    
    return response.json();
  }

  async getConsumption(params?: {
    userId?: string;
    useCaseId?: string;
    from?: string;
    to?: string;
  }): Promise<ConsumptionRecord[]> {
    if (USE_MOCK_API) {
      return mockApiService.getConsumption(params);
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
      throw new Error('Failed to fetch consumption data');
    }
    
    return response.json();
  }
}

export const apiService = new ApiService();
