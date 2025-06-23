
import React from 'react';
import { Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { logger, LogCategory } from '../utils/logger';

const FeatureFlagsManager = () => {
  const { flags, updateFlag, isAdmin } = useFeatureFlags();

  if (!isAdmin) {
    return null;
  }

  const handleToggle = (key: keyof typeof flags, checked: boolean) => {
    logger.info(LogCategory.USER_ACTION, 'Feature flag toggle attempted', { key, checked });
    updateFlag(key, checked);
  };

  const featureOptions = [
    {
      key: 'showUserActivityPanel' as const,
      title: 'Panneau d\'activité utilisateur',
      description: 'Afficher les métriques d\'activité utilisateur sur la page d\'accueil',
    },
    {
      key: 'showAdminDashboard' as const,
      title: 'Tableau de bord admin',
      description: 'Afficher le lien vers le tableau de bord dans le menu principal',
    },
    {
      key: 'showUserSelector' as const,
      title: 'Sélecteur d\'utilisateur',
      description: 'Afficher le bouton de changement d\'utilisateur dans les informations utilisateur',
    },
  ];

  return (
    <div className="border-t pt-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Settings className="h-5 w-5 mr-2" />
        Gestion des fonctionnalités (Admin)
      </h2>
      
      <div className="space-y-4">
        {featureOptions.map((option) => (
          <div 
            key={option.key}
            className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">{option.title}</h3>
              <p className="text-sm text-blue-800">{option.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={flags[option.key]}
                onCheckedChange={(checked) => handleToggle(option.key, checked)}
              />
              {flags[option.key] ? (
                <ToggleRight className="h-4 w-4 text-green-600" />
              ) : (
                <ToggleLeft className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Ces paramètres ne sont visibles et modifiables que par les administrateurs. 
          Les modifications prennent effet immédiatement.
        </p>
      </div>
    </div>
  );
};

export default FeatureFlagsManager;
