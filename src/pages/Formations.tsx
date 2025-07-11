
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { apiService } from '../services/api';
import { toast } from '@/hooks/use-toast';

const Formations = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Fetch user profile for header
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: apiService.fetchUserProfile,
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('hasVisitedPortal');
    setIsAuthenticated(false);
    toast({
      title: "Déconnecté",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Veuillez vous connecter</h1>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Connexion (Demo)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Formations
          </h1>
          <p className="text-gray-600">
            Accédez à nos formations pour maîtriser les outils GAÏA.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Formation de base obligatoire
          </h2>
          <p className="text-gray-600 mb-4">
            Cette formation est requise pour utiliser les outils GAÏA. Elle vous permettra de comprendre les concepts de base et les bonnes pratiques.
          </p>
          <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
            Commencer la formation
          </button>
        </div>
      </main>
    </div>
  );
};

export default Formations;
