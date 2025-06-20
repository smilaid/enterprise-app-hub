
import React, { useState, useEffect } from 'react';
import { User, Shield, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import mockUsersData from '../mock/authData.json';
import { AuthUser } from '../services/authService';

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
  currentUser: AuthUser | null;
  onUserSelect: (user: UserAccount) => void;
  isAuthenticated?: boolean;
}

const UserSelector = ({ currentUser, isAuthenticated = false }: UserSelectorProps) => {
  // Load users from mock data
  const [users] = useState<UserAccount[]>(mockUsersData.users);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Convert AuthUser to UserAccount format when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const userAccount: UserAccount = {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        email: currentUser.email,
        role: currentUser.role,
        originalRole: currentUser.role, // Use role as originalRole for AuthUser
        groups: currentUser.groups || []
      };
      setSelectedUser(userAccount);
    } else {
      setSelectedUser(null);
    }
  }, [currentUser]);

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

  const handleUserChange = () => {
    if (selectedUser && selectedUser.id !== currentUser?.id) {
      // Update the selected user in localStorage
      localStorage.setItem('mockUserId', selectedUser.id);
      
      if (isAuthenticated) {
        // If authenticated, logout first then reload
        localStorage.removeItem('demo_auth_token');
        localStorage.removeItem('hasVisitedPortal');
      }
      
      // Set the auth token for the new user
      localStorage.setItem('demo_auth_token', 'demo-token');
      
      // Refresh the page to apply changes
      window.location.reload();
    }
    setIsOpen(false);
  };

  // Always show selector in development mode
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    return null;
  }

  // Show differently when authenticated vs not authenticated
  const buttonText = isAuthenticated ? 'Changer d\'utilisateur' : 'Sélectionner utilisateur';

  return (
    <div className="border-t pt-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost"
            className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            size="sm"
          >
            <User className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isAuthenticated ? 'Changer d\'utilisateur test' : 'Choisir un utilisateur pour se connecter'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mb-4">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedUser?.id === user.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedUser(user)}
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
                  {selectedUser?.id === user.id && (
                    <div className="text-blue-600 text-sm font-medium">
                      Sélectionné
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {selectedUser?.id !== currentUser?.id 
                ? 'Cliquez sur "Changer d\'utilisateur" pour confirmer' 
                : 'Utilisateur actuel sélectionné'
              }
            </div>
            <Button 
              onClick={handleUserChange}
              disabled={!selectedUser || selectedUser.id === currentUser?.id}
              className="ml-2"
            >
              {isAuthenticated ? 'Changer d\'utilisateur' : 'Se connecter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSelector;
