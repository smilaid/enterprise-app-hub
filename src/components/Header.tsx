
import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { UserProfile } from '../services/api';

interface HeaderProps {
  user?: UserProfile;
  onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Menu */}
          <nav className="flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
              Actualités
            </a>
            <a href="/politique-ia" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
              Politique IA
            </a>
            <a href="/formations" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
              Formations
            </a>
            <a href="/contact" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
              Contact
            </a>
            <a href="/aide" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
              Aide
            </a>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center border">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user.displayName}</p>
                </div>
              </div>
            )}
            
            {onLogout && (
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
