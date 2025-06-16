
import React from 'react';
import { X, Sparkles, GraduationCap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const WelcomeModal = ({ isOpen, onClose, userName }: WelcomeModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleFormationCompleted = () => {
    onClose();
  };

  const handleNeedsFormation = () => {
    onClose();
    navigate('/formations');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      aria-describedby="welcome-modal-description"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative focus:outline-none" tabIndex={-1}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-sm"
          aria-label="Fermer la boîte de dialogue"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <Sparkles className="h-8 w-8 text-red-600" />
          </div>
          <h2 id="welcome-modal-title" className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenue sur le portail GAÏA{userName ? `, ${userName}` : ''} !
          </h2>
          <p id="welcome-modal-description" className="text-gray-600">
            Découvrez et accédez aux applications d'IA adaptées à votre rôle et permissions.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" role="alert">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Formation obligatoire</h3>
              <p className="text-sm text-blue-800 mb-3">
                Une formation de base sur l'utilisation éthique et responsable de l'IA est requise 
                avant d'accéder aux outils de la plateforme.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-5 w-5 text-red-600" aria-hidden="true" />
            <span className="font-medium text-gray-900">
              Avez-vous déjà suivi cette formation ?
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleNeedsFormation}
            className="flex-1 bg-white border border-red-600 text-red-600 py-2 px-4 rounded-md hover:bg-red-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Non, m'inscrire
          </button>
          <button
            onClick={handleFormationCompleted}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Oui, continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
