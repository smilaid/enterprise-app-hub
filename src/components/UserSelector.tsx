
import React from 'react';
import { User, Shield, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: string;
  originalRole: string;
  groups: string[];
}

interface UserSelectorProps {
  users: UserAccount[];
  currentUser: UserAccount | null;
  onUserSelect: (user: UserAccount) => void;
  isAuthenticated?: boolean;
}

const UserSelector = ({ users, currentUser, onUserSelect, isAuthenticated = false }: UserSelectorProps) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheck className="h-4 w-4 text-red-600" />;
      case 'contributor': return <Shield className="h-4 w-4 text-blue-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'contributor': return 'Contributeur';
      default: return 'Utilisateur';
    }
  };

  // Only show selector in development mode
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    return null;
  }

  // Show differently when authenticated vs not authenticated
  const buttonText = isAuthenticated ? '👤 Test Users' : '👤 Select User to Login';
  const buttonVariant = isAuthenticated ? 'outline' : 'default';
  const buttonClass = isAuthenticated 
    ? 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant={buttonVariant}
            className={buttonClass}
          >
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isAuthenticated ? 'Sélectionner un utilisateur test' : 'Choisir un utilisateur pour se connecter'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  currentUser?.id === user.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onUserSelect(user)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="font-medium">{user.displayName}</span>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
                  </div>
                  {currentUser?.id === user.id && (
                    <div className="text-blue-600 text-sm font-medium">
                      {isAuthenticated ? 'Actuel' : 'Sélectionné'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!isAuthenticated && (
            <div className="text-sm text-gray-500 text-center mt-4">
              Sélectionnez un utilisateur puis cliquez sur "Se connecter"
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSelector;
