
import { UserProfile, UseCaseSummary, ConsumptionRecord, UserActivityMetrics, CreateUseCaseData, GlobalMetrics, UseCaseUsageStats } from '../services/api';
import mockData from './database.json';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store that starts with the JSON data
let inMemoryData = JSON.parse(JSON.stringify(mockData));

class MockApiService {
  async fetchUserProfile(): Promise<UserProfile> {
    await delay(500); // Simulate network delay
    
    const user = inMemoryData.users[0]; // Return the first (and only) user
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
    
    let useCases = [...inMemoryData.useCases];
    
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
    
    // Update or add recent access record
    const existingRecentIndex = inMemoryData.recents.findIndex(
      recent => recent.userId === userId && recent.useCaseId === useCaseId
    );
    
    const currentTime = new Date().toISOString();
    
    if (existingRecentIndex > -1) {
      // Update existing recent record
      inMemoryData.recents[existingRecentIndex].lastAccessed = currentTime;
    } else {
      // Add new recent record
      const newRecent = {
        id: crypto.randomUUID(),
        userId,
        useCaseId,
        lastAccessed: currentTime
      };
      inMemoryData.recents.push(newRecent);
    }
    
    // Generate a new consumption record
    const newRecord: ConsumptionRecord = {
      id: crypto.randomUUID(),
      userId,
      useCaseId,
      tokensUsed: Math.floor(Math.random() * 2000) + 500, // Random tokens between 500-2500
      costEur: Math.round((Math.random() * 0.05 + 0.01) * 100) / 100, // Random cost between 0.01-0.06 EUR
      carbonKg: Math.round((Math.random() * 0.003 + 0.001) * 10000) / 10000, // Random carbon between 0.001-0.004 kg
      occurredAt: currentTime
    };
    
    // Add to consumption records
    inMemoryData.consumption.push(newRecord);
    
    console.log('Logged use case access:', newRecord);
    console.log('Updated recent access:', { userId, useCaseId, lastAccessed: currentTime });
    
    return newRecord;
  }

  async addToFavorites(userId: string, useCaseId: string): Promise<void> {
    await delay(300);
    
    // Check if already in favorites
    const existingFavorite = inMemoryData.favorites.find(
      fav => fav.userId === userId && fav.useCaseId === useCaseId
    );
    
    if (existingFavorite) {
      return; // Already a favorite
    }
    
    // Add to favorites
    const newFavorite = {
      id: crypto.randomUUID(),
      userId,
      useCaseId,
      createdAt: new Date().toISOString()
    };
    
    inMemoryData.favorites.push(newFavorite);
    console.log('Added to favorites:', newFavorite);
  }

  async getFavorites(userId: string): Promise<string[]> {
    await delay(400);
    
    const userFavorites = inMemoryData.favorites
      .filter(fav => fav.userId === userId)
      .map(fav => fav.useCaseId);
    
    return userFavorites;
  }

  async removeFavorite(userId: string, useCaseId: string): Promise<void> {
    await delay(300);
    
    // Remove from favorites
    const index = inMemoryData.favorites.findIndex(
      fav => fav.userId === userId && fav.useCaseId === useCaseId
    );
    
    if (index > -1) {
      inMemoryData.favorites.splice(index, 1);
      console.log('Removed from favorites:', { userId, useCaseId });
    }
  }

  async getRecents(userId: string): Promise<Array<{ useCaseId: string; lastAccessed: string }>> {
    await delay(350);
    
    const userRecents = inMemoryData.recents
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
    
    let consumption = [...inMemoryData.consumption];
    
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

  async getUserActivityMetrics(userId: string): Promise<UserActivityMetrics> {
    await delay(600);
    
    // Generate realistic mock data based on the user's consumption history
    const userConsumption = inMemoryData.consumption.filter(c => c.userId === userId);
    
    const totalRequests = userConsumption.length + Math.floor(Math.random() * 50);
    const totalTokens = userConsumption.reduce((sum, c) => sum + c.tokensUsed, 0) + Math.floor(Math.random() * 10000);
    const totalCost = userConsumption.reduce((sum, c) => sum + c.costEur, 0) + (Math.random() * 5);
    const carbonImpact = userConsumption.reduce((sum, c) => sum + c.carbonKg, 0) + (Math.random() * 0.1);
    
    return {
      totalRequests,
      totalTokens,
      totalCost: Math.round(totalCost * 100) / 100,
      carbonImpact: Math.round(carbonImpact * 10000) / 10000,
      period: 'current_month'
    };
  }

  async createUseCase(data: CreateUseCaseData): Promise<UseCaseSummary> {
    await delay(800);
    
    const currentTime = new Date().toISOString();
    const newUseCase: UseCaseSummary = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      status: data.status,
      scope: data.scope,
      ownerId: data.ownerId,
      icon: data.icon || '🔧',
      accessUrl: data.accessUrl,
      guideUrl: data.guideUrl
    };
    
    // Add to in-memory data with timestamp fields
    const newUseCaseWithTimestamps = {
      ...newUseCase,
      icon: newUseCase.icon || '🔧',
      accessUrl: newUseCase.accessUrl || '',
      guideUrl: newUseCase.guideUrl || '',
      createdAt: currentTime,
      updatedAt: currentTime
    };
    
    // Update the in-memory database
    inMemoryData.useCases.push(newUseCaseWithTimestamps);
    
    console.log('Created new use case:', newUseCase);
    console.log('Total use cases in database:', inMemoryData.useCases.length);
    
    return newUseCase;
  }

  async updateUseCase(id: string, data: Partial<CreateUseCaseData>): Promise<UseCaseSummary> {
    await delay(600);
    
    const useCaseIndex = inMemoryData.useCases.findIndex(uc => uc.id === id);
    if (useCaseIndex === -1) {
      throw new Error('Use case not found');
    }
    
    const currentUseCase = inMemoryData.useCases[useCaseIndex];
    const updatedUseCase = {
      ...currentUseCase,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    inMemoryData.useCases[useCaseIndex] = updatedUseCase;
    
    console.log('Updated use case:', updatedUseCase);
    return updatedUseCase;
  }

  async deleteUseCase(id: string): Promise<void> {
    await delay(400);
    
    const useCaseIndex = inMemoryData.useCases.findIndex(uc => uc.id === id);
    if (useCaseIndex === -1) {
      throw new Error('Use case not found');
    }
    
    // Remove the use case
    const deletedUseCase = inMemoryData.useCases.splice(useCaseIndex, 1)[0];
    
    // Also remove related favorites and recents
    inMemoryData.favorites = inMemoryData.favorites.filter(fav => fav.useCaseId !== id);
    inMemoryData.recents = inMemoryData.recents.filter(recent => recent.useCaseId !== id);
    
    console.log('Deleted use case:', deletedUseCase);
  }

  async getGlobalMetrics(): Promise<GlobalMetrics> {
    await delay(600);
    
    // Calculate metrics from all consumption records
    const totalRequests = inMemoryData.consumption.length + Math.floor(Math.random() * 500);
    const totalTokens = inMemoryData.consumption.reduce((sum, c) => sum + c.tokensUsed, 0) + Math.floor(Math.random() * 50000);
    const totalCost = inMemoryData.consumption.reduce((sum, c) => sum + c.costEur, 0) + (Math.random() * 50);
    const carbonImpact = inMemoryData.consumption.reduce((sum, c) => sum + c.carbonKg, 0) + (Math.random() * 1);
    
    return {
      totalRequests,
      totalTokens,
      totalCost: Math.round(totalCost * 100) / 100,
      carbonImpact: Math.round(carbonImpact * 10000) / 10000,
      activeUsers: inMemoryData.users.length + Math.floor(Math.random() * 20),
      period: 'global'
    };
  }

  async getUseCaseUsageStats(): Promise<UseCaseUsageStats[]> {
    await delay(700);
    
    // Group consumption by use case
    const usageMap = new Map<string, { count: number; tokens: number; cost: number }>();
    
    inMemoryData.consumption.forEach(record => {
      const existing = usageMap.get(record.useCaseId) || { count: 0, tokens: 0, cost: 0 };
      usageMap.set(record.useCaseId, {
        count: existing.count + 1,
        tokens: existing.tokens + record.tokensUsed,
        cost: existing.cost + record.costEur
      });
    });
    
    // Convert to stats array
    const stats: UseCaseUsageStats[] = [];
    usageMap.forEach((usage, useCaseId) => {
      const useCase = inMemoryData.useCases.find(uc => uc.id === useCaseId);
      if (useCase) {
        stats.push({
          useCaseId,
          name: useCase.name,
          icon: useCase.icon,
          usageCount: usage.count,
          totalTokens: usage.tokens,
          totalCost: Math.round(usage.cost * 100) / 100
        });
      }
    });
    
    // Add some random usage for use cases without consumption records
    inMemoryData.useCases.forEach(useCase => {
      if (!stats.find(s => s.useCaseId === useCase.id)) {
        const randomUsage = Math.floor(Math.random() * 10);
        if (randomUsage > 0) {
          stats.push({
            useCaseId: useCase.id,
            name: useCase.name,
            icon: useCase.icon,
            usageCount: randomUsage,
            totalTokens: randomUsage * (500 + Math.floor(Math.random() * 1000)),
            totalCost: Math.round(randomUsage * (0.01 + Math.random() * 0.05) * 100) / 100
          });
        }
      }
    });
    
    return stats.sort((a, b) => b.usageCount - a.usageCount);
  }
}

export const mockApiService = new MockApiService();
