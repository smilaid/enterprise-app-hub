
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { apiService } from '../services/api';
import { toast } from '@/hooks/use-toast';

const Aide = () => {
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
            Aide
          </h1>
          <p className="text-gray-600">
            Trouvez les réponses à vos questions et accédez à la documentation.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-500">
            Documentation d'aide à venir...
          </p>
        </div>
      </main>
    </div>
  );
};

export default Aide;
