
import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthUser } from '../services/authService';
import { logger, LogCategory } from '../utils/logger';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user?: AuthUser;
  onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const handleNavClick = (destination: string) => {
    logger.info(LogCategory.NAVIGATION, 'Navigation link clicked', { destination, userId: user?.id });
  };

  const handleProfileView = () => {
    logger.info(LogCategory.USER_ACTION, 'Profile view initiated', { userId: user?.id });
  };

  const handleLogoutClick = () => {
    logger.info(LogCategory.AUTH, 'Logout button clicked', { userId: user?.id });
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold text-red-600 hover:text-red-700"
              onClick={() => handleNavClick('home')}
            >
              GAÏA
            </Link>
          </div>

          {/* Navigation Menu and User Profile on the right */}
          <div className="flex items-center space-x-8">
            {/* Navigation Menu */}
            <nav className="flex space-x-8">
              <Link 
                to="/actualites" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                onClick={() => handleNavClick('actualites')}
              >
                Actualités
              </Link>
              <Link 
                to="/politique-ia" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                onClick={() => handleNavClick('politique-ia')}
              >
                Politique IA
              </Link>
              <Link 
                to="/formations" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                onClick={() => handleNavClick('formations')}
              >
                Formations
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                onClick={() => handleNavClick('contact')}
              >
                Contact
              </Link>
              <Link 
                to="/aide" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                onClick={() => handleNavClick('aide')}
              >
                Aide
              </Link>
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              {user && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center border">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium">{user.displayName}</p>
                      </div>
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64" align="end">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center border">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.displayName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">{user.role}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3 space-y-2">
                        <Link to="/profile" onClick={handleProfileView}>
                          <Button variant="ghost" className="w-full justify-start" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Voir le profil
                          </Button>
                        </Link>
                        
                        {onLogout && (
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                            size="sm"
                            onClick={handleLogoutClick}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Se déconnecter
                          </Button>
                        )}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
