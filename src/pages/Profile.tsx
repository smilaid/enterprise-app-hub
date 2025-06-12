
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Settings, RotateCcw, Download, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import { apiService } from '../services/api';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { logger, LogCategory } from '../utils/logger';

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Fetch user profile
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: apiService.fetchUserProfile,
    enabled: isAuthenticated,
  });

  const [showWelcomeOnRefresh, setShowWelcomeOnRefresh] = useState(false);

  const handleLogout = () => {
    logger.info(LogCategory.AUTH, 'Logout from profile page', { userId: user?.id });
    localStorage.removeItem('authToken');
    localStorage.removeItem('hasVisitedPortal');
    setIsAuthenticated(false);
    toast({
      title: "Déconnecté",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  const handleResetWelcomeMessage = () => {
    logger.info(LogCategory.USER_ACTION, 'Welcome message reset', { userId: user?.id });
    localStorage.removeItem('hasVisitedPortal');
    toast({
      title: "Paramètres réinitialisés",
      description: "Le message de bienvenue s'affichera lors du prochain rafraîchissement.",
    });
  };

  const handleToggleWelcomeMessage = (checked: boolean) => {
    logger.info(LogCategory.USER_ACTION, 'Welcome message toggle', { checked, userId: user?.id });
    setShowWelcomeOnRefresh(checked);
    if (checked) {
      localStorage.removeItem('hasVisitedPortal');
      toast({
        title: "Mode développement activé",
        description: "Le message de bienvenue s'affichera au prochain rafraîchissement.",
      });
    } else {
      localStorage.setItem('hasVisitedPortal', 'true');
      toast({
        title: "Mode développement désactivé",
        description: "Le message de bienvenue ne s'affichera plus.",
      });
    }
  };

  const handleExportLogs = () => {
    logger.info(LogCategory.USER_ACTION, 'Log export initiated', { userId: user?.id });
    try {
      const logs = logger.exportLogs();
      const blob = new Blob([logs], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gaia-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Logs exportés",
        description: "Les logs ont été téléchargés avec succès.",
      });
    } catch (error) {
      logger.error(LogCategory.SYSTEM, 'Failed to export logs', { error, userId: user?.id });
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les logs.",
        variant: "destructive",
      });
    }
  };

  const handleClearLogs = () => {
    logger.info(LogCategory.USER_ACTION, 'Log clear initiated', { userId: user?.id });
    logger.clearLogs();
    toast({
      title: "Logs supprimés",
      description: "Tous les logs ont été supprimés.",
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header onLogout={handleLogout} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">Chargement du profil...</div>
        </div>
      </div>
    );
  }

  // Check if user is admin (for advanced features)
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center border">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Rôle: {user.role}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Informations du profil
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur
                </label>
                <p className="text-gray-900">{user.username}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Utilisateur
                </label>
                <p className="text-gray-900 font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Paramètres de développement
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-yellow-900">Message de bienvenue</h3>
                  <p className="text-sm text-yellow-800">
                    Réinitialiser l'affichage du message de bienvenue au prochain rafraîchissement
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={showWelcomeOnRefresh}
                    onCheckedChange={handleToggleWelcomeMessage}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleResetWelcomeMessage}
                    className="flex items-center space-x-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </Button>
                </div>
              </div>

              {isAdmin && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-3">Gestion des logs (Admin)</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Exporter ou supprimer les logs de l'application pour le débogage et la surveillance.
                  </p>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleExportLogs}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exporter logs</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleClearLogs}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Vider logs</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
