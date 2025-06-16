
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import UseCaseCard from '../components/UseCaseCard';
import WelcomeModal from '../components/WelcomeModal';
import LoadingSpinner from '../components/LoadingSpinner';
import SkipLink from '../components/SkipLink';
import { apiService, UseCaseSummary } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { logger, LogCategory } from '../utils/logger';

const Index = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Use the new authentication system
  const { isAuthenticated, user, isLoading: isAuthLoading, login, logout } = useAuth();

  // Fetch use cases
  const { data: useCases = [], isLoading: isLoadingUseCases } = useQuery({
    queryKey: ['use-cases'],
    queryFn: () => apiService.fetchUseCases(),
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
    logger.debug(LogCategory.UI, 'Favorites updated', { count: userFavorites.length });
  }, [userFavorites]);

  // Check if this is the user's first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedPortal');
    if (!hasVisited && user) {
      logger.info(LogCategory.UI, 'First visit detected, showing welcome modal', { userId: user.id });
      setShowWelcomeModal(true);
      localStorage.setItem('hasVisitedPortal', 'true');
    }
  }, [user]);

  const handleAccess = async (useCaseId: string) => {
    if (!user) {
      logger.warn(LogCategory.USER_ACTION, 'Access attempt without authenticated user', { useCaseId });
      return;
    }

    logger.info(LogCategory.USER_ACTION, 'Use case access initiated', { useCaseId, userId: user.id });

    try {
      await apiService.logUseCaseAccess(useCaseId, user.id);
      const useCase = useCases.find(uc => uc.id === useCaseId);
      
      if (useCase?.accessUrl) {
        logger.info(LogCategory.NAVIGATION, 'Opening external URL', { url: useCase.accessUrl, useCaseId });
        window.open(useCase.accessUrl, '_blank');
      } else {
        logger.warn(LogCategory.UI, 'No access URL configured for use case', { useCaseId });
        toast({
          title: "Access Tool",
          description: "Opening application...",
        });
      }
    } catch (error) {
      logger.error(LogCategory.USER_ACTION, 'Failed to access use case', { error, useCaseId, userId: user.id });
      toast({
        title: "Error",
        description: "Failed to access the tool. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGuide = (useCaseId: string) => {
    logger.info(LogCategory.USER_ACTION, 'Guide access initiated', { useCaseId });
    const useCase = useCases.find(uc => uc.id === useCaseId);
    if (useCase?.guideUrl) {
      logger.info(LogCategory.NAVIGATION, 'Opening guide URL', { url: useCase.guideUrl, useCaseId });
      window.open(useCase.guideUrl, '_blank');
    } else {
      logger.warn(LogCategory.UI, 'No guide URL configured for use case', { useCaseId });
      toast({
        title: "Guide",
        description: "Opening user guide...",
      });
    }
  };

  const handleToggleFavorite = async (useCaseId: string) => {
    if (!user) {
      logger.warn(LogCategory.USER_ACTION, 'Favorite toggle attempt without authenticated user', { useCaseId });
      return;
    }

    const isFavorite = favorites.includes(useCaseId);
    logger.info(LogCategory.USER_ACTION, 'Toggling favorite', { useCaseId, userId: user.id, isFavorite });

    try {
      if (isFavorite) {
        await apiService.removeFavorite(user.id, useCaseId);
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
      logger.error(LogCategory.USER_ACTION, 'Failed to toggle favorite', { error, useCaseId, userId: user.id });
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle authentication loading
  if (isAuthLoading) {
    logger.debug(LogCategory.AUTH, 'Authentication loading');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
        <span className="sr-only">Chargement de l'authentification...</span>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!isAuthenticated) {
    logger.debug(LogCategory.AUTH, 'User not authenticated, showing login screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <SkipLink />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Veuillez vous connecter pour accéder au portail</h1>
          <button
            onClick={login}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Se connecter à l'application"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  logger.debug(LogCategory.UI, 'Rendering main dashboard', { 
    useCaseCount: useCases.length, 
    favoriteCount: favorites.length,
    isLoading: isLoadingUseCases 
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <SkipLink />
      <Header user={user} onLogout={logout} />
      
      <main id="main-content" className="max-w-6xl mx-auto px-6 py-8" role="main">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue sur le portail <span className="text-red-600">GAÏA</span>
          </h1>
          <h2 className="text-xl text-gray-700 font-medium">
            Vos Assistants
          </h2>
        </div>

        {/* Use Cases Grid */}
        {isLoadingUseCases ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="sr-only">Chargement des applications...</span>
          </div>
        ) : useCases.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <h3 className="text-lg font-medium">Aucune application trouvée</h3>
              <p>Aucun cas d'usage n'est actuellement disponible.</p>
            </div>
          </div>
        ) : (
          <section aria-labelledby="applications-heading">
            <h2 id="applications-heading" className="sr-only">Liste des applications disponibles</h2>
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
          </section>
        )}
      </main>

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => {
          logger.info(LogCategory.UI, 'Welcome modal closed');
          setShowWelcomeModal(false);
        }}
        userName={user?.displayName}
      />
    </div>
  );
};

export default Index;
