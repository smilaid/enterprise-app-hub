
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
            Bienvenue sur le portail GAÏA{userName ? `, ${userName}` : ''} !
          </h2>
          <p className="text-gray-600">
            Découvrez et accédez aux applications d'IA adaptées à votre rôle et permissions.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
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
            <GraduationCap className="h-5 w-5 text-red-600" />
            <span className="font-medium text-gray-900">
              Avez-vous déjà suivi cette formation ?
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleNeedsFormation}
            className="flex-1 bg-white border border-red-600 text-red-600 py-2 px-4 rounded-md hover:bg-red-50 transition-colors font-medium"
          >
            Non, m'inscrire
          </button>
          <button
            onClick={handleFormationCompleted}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Oui, continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
