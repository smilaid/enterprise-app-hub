
import { UserProfile, UseCaseSummary, ConsumptionRecord } from '../services/api';
import mockData from './database.json';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  async fetchUserProfile(): Promise<UserProfile> {
    await delay(500); // Simulate network delay
    
    const user = mockData.users[0]; // Return the first (and only) user
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  async fetchUseCases(params?: {
    status?: string;
    owner?: string;
    search?: string;
    scope?: string;
  }): Promise<UseCaseSummary[]> {
    await delay(800); // Simulate network delay
    
    let useCases = [...mockData.useCases];
    
    // Apply filters if provided
    if (params) {
      if (params.status) {
        useCases = useCases.filter(uc => uc.status === params.status);
      }
      if (params.owner) {
        useCases = useCases.filter(uc => uc.ownerId === params.owner);
      }
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        useCases = useCases.filter(uc => 
          uc.name.toLowerCase().includes(searchLower) ||
          uc.description.toLowerCase().includes(searchLower)
        );
      }
      if (params.scope) {
        useCases = useCases.filter(uc => uc.scope === params.scope);
      }
    }
    
    return useCases;
  }

  async logUseCaseAccess(useCaseId: string, userId: string): Promise<ConsumptionRecord> {
    await delay(300);
    
    // Generate a new consumption record
    const newRecord: ConsumptionRecord = {
      id: crypto.randomUUID(),
      userId,
      useCaseId,
      tokensUsed: Math.floor(Math.random() * 2000) + 500, // Random tokens between 500-2500
      costEur: Math.round((Math.random() * 0.05 + 0.01) * 100) / 100, // Random cost between 0.01-0.06 EUR
      carbonKg: Math.round((Math.random() * 0.003 + 0.001) * 10000) / 10000, // Random carbon between 0.001-0.004 kg
      occurredAt: new Date().toISOString()
    };
    
    // In a real implementation, this would be saved to the database
    console.log('Logged use case access:', newRecord);
    
    return newRecord;
  }

  async addToFavorites(userId: string, useCaseId: string): Promise<void> {
    await delay(300);
    
    // Check if already in favorites
    const existingFavorite = mockData.favorites.find(
      fav => fav.userId === userId && fav.useCaseId === useCaseId
    );
    
    if (existingFavorite) {
      return; // Already a favorite
    }
    
    // Add to favorites (in memory only for this mock)
    const newFavorite = {
      id: crypto.randomUUID(),
      userId,
      useCaseId,
      createdAt: new Date().toISOString()
    };
    
    mockData.favorites.push(newFavorite);
    console.log('Added to favorites:', newFavorite);
  }

  async getFavorites(userId: string): Promise<string[]> {
    await delay(400);
    
    const userFavorites = mockData.favorites
      .filter(fav => fav.userId === userId)
      .map(fav => fav.useCaseId);
    
    return userFavorites;
  }

  async removeFavorite(userId: string, useCaseId: string): Promise<void> {
    await delay(300);
    
    // Remove from favorites (in memory only for this mock)
    const index = mockData.favorites.findIndex(
      fav => fav.userId === userId && fav.useCaseId === useCaseId
    );
    
    if (index > -1) {
      mockData.favorites.splice(index, 1);
      console.log('Removed from favorites:', { userId, useCaseId });
    }
  }

  async getRecents(userId: string): Promise<Array<{ useCaseId: string; lastAccessed: string }>> {
    await delay(350);
    
    const userRecents = mockData.recents
      .filter(recent => recent.userId === userId)
      .map(recent => ({
        useCaseId: recent.useCaseId,
        lastAccessed: recent.lastAccessed
      }))
      .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
    
    return userRecents;
  }

  async getConsumption(params?: {
    userId?: string;
    useCaseId?: string;
    from?: string;
    to?: string;
  }): Promise<ConsumptionRecord[]> {
    await delay(600);
    
    let consumption = [...mockData.consumption];
    
    if (params) {
      if (params.userId) {
        consumption = consumption.filter(c => c.userId === params.userId);
      }
      if (params.useCaseId) {
        consumption = consumption.filter(c => c.useCaseId === params.useCaseId);
      }
      if (params.from) {
        consumption = consumption.filter(c => c.occurredAt >= params.from!);
      }
      if (params.to) {
        consumption = consumption.filter(c => c.occurredAt <= params.to!);
      }
    }
    
    return consumption.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }
}

export const mockApiService = new MockApiService();
