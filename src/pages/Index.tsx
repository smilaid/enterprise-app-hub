
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import UseCaseCard from '../components/UseCaseCard';
import WelcomeModal from '../components/WelcomeModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService, UserProfile, UseCaseSummary } from '../services/api';
import { Search, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Mock authentication - in real app this would come from auth provider
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Fetch user profile
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-profile'],
    queryFn: apiService.fetchUserProfile,
    enabled: isAuthenticated,
  });

  // Fetch use cases
  const { data: useCases = [], isLoading: isLoadingUseCases, refetch } = useQuery({
    queryKey: ['use-cases', { search: searchTerm, status: statusFilter }],
    queryFn: () => apiService.fetchUseCases({
      search: searchTerm || undefined,
      status: statusFilter || undefined,
    }),
    enabled: isAuthenticated,
  });

  // Fetch favorites
  const { data: userFavorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? apiService.getFavorites(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  useEffect(() => {
    setFavorites(userFavorites);
  }, [userFavorites]);

  // Check if this is the user's first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedPortal');
    if (!hasVisited && user) {
      setShowWelcomeModal(true);
      localStorage.setItem('hasVisitedPortal', 'true');
    }
  }, [user]);

  const handleAccess = async (useCaseId: string) => {
    if (!user) return;

    try {
      await apiService.logUseCaseAccess(useCaseId, user.id);
      const useCase = useCases.find(uc => uc.id === useCaseId);
      
      if (useCase?.accessUrl) {
        window.open(useCase.accessUrl, '_blank');
      } else {
        toast({
          title: "Access Tool",
          description: "Opening application...",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access the tool. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGuide = (useCaseId: string) => {
    const useCase = useCases.find(uc => uc.id === useCaseId);
    if (useCase?.guideUrl) {
      window.open(useCase.guideUrl, '_blank');
    } else {
      toast({
        title: "Guide",
        description: "Opening user guide...",
      });
    }
  };

  const handleToggleFavorite = async (useCaseId: string) => {
    if (!user) return;

    try {
      const isFavorite = favorites.includes(useCaseId);
      
      if (isFavorite) {
        // Remove from favorites (API endpoint not in swagger, but implied)
        setFavorites(prev => prev.filter(id => id !== useCaseId));
      } else {
        await apiService.addToFavorites(user.id, useCaseId);
        setFavorites(prev => [...prev, useCaseId]);
      }

      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `Use case ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('hasVisitedPortal');
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access the portal</h1>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Login (Demo)
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        {user && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.displayName}!
            </h1>
            <p className="text-gray-600">
              Discover and access your authorized AI applications below.
            </p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="beta">Beta</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>
        </div>

        {/* Use Cases Grid */}
        {isLoadingUseCases ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : useCases.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No applications found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <UseCaseCard
                key={useCase.id}
                useCase={useCase}
                isFavorite={favorites.includes(useCase.id)}
                onAccess={handleAccess}
                onGuide={handleGuide}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        userName={user?.displayName}
      />
    </div>
  );
};

export default Index;
