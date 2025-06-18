
import React, { useState } from 'react';
import { Shield, ShieldCheck, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { logger, LogCategory } from '../utils/logger';

interface RoleSwitcherProps {
  currentRole: string;
  originalRole: string;
  onRoleChange: (newRole: string) => void;
}

const RoleSwitcher = ({ currentRole, originalRole, onRoleChange }: RoleSwitcherProps) => {
  const [isChanging, setIsChanging] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    setIsChanging(true);
    logger.info(LogCategory.USER_ACTION, 'Role change initiated', { from: currentRole, to: newRole });

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onRoleChange(newRole);
      
      toast({
        title: "Rôle modifié",
        description: `Vous êtes maintenant en mode ${newRole}.`,
      });
    } catch (error) {
      logger.error(LogCategory.USER_ACTION, 'Role change failed', { error });
      toast({
        title: "Erreur",
        description: "Impossible de changer de rôle.",
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheck className="h-4 w-4" />;
      case 'contributor': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'contributor': return 'Contributeur';
      default: return 'Utilisateur';
    }
  };

  if (originalRole === 'user') {
    return null; // Users can't switch roles
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-medium text-blue-900 mb-3">Changement de rôle</h3>
      <p className="text-sm text-blue-800 mb-4">
        Rôle actuel: {getRoleLabel(currentRole)} 
        {currentRole !== originalRole && ` (original: ${getRoleLabel(originalRole)})`}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {originalRole === 'admin' && currentRole !== 'user' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRoleChange('user')}
            disabled={isChanging}
            className="flex items-center space-x-1"
          >
            <User className="h-4 w-4" />
            <span>Mode Utilisateur</span>
          </Button>
        )}
        
        {originalRole === 'admin' && currentRole !== 'contributor' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRoleChange('contributor')}
            disabled={isChanging}
            className="flex items-center space-x-1"
          >
            <Shield className="h-4 w-4" />
            <span>Mode Contributeur</span>
          </Button>
        )}
        
        {(originalRole === 'contributor' || originalRole === 'admin') && currentRole !== 'user' && originalRole !== 'admin' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRoleChange('user')}
            disabled={isChanging}
            className="flex items-center space-x-1"
          >
            <User className="h-4 w-4" />
            <span>Mode Utilisateur</span>
          </Button>
        )}
        
        {currentRole !== originalRole && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRoleChange(originalRole)}
            disabled={isChanging}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            {getRoleIcon(originalRole)}
            <span>Retour {getRoleLabel(originalRole)}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoleSwitcher;
