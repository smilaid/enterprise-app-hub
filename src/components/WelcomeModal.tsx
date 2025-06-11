
import React from 'react';
import { X, Sparkles, Shield, Zap } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const WelcomeModal = ({ isOpen, onClose, userName }: WelcomeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to the Enterprise AI Portal{userName ? `, ${userName}` : ''}!
          </h2>
          <p className="text-gray-600">
            Discover and access powerful AI applications tailored to your role and permissions.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Personalized Access</h3>
              <p className="text-sm text-gray-600">Only see applications you're authorized to use based on your role.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Quick Access</h3>
              <p className="text-sm text-gray-600">Click "Access Tool" to launch applications or "Guide" for documentation.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
