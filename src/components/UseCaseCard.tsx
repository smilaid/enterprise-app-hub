
import React from 'react';
import { ExternalLink, BookOpen, Heart } from 'lucide-react';
import { UseCaseSummary } from '../services/api';

interface UseCaseCardProps {
  useCase: UseCaseSummary;
  isFavorite?: boolean;
  onAccess: (useCaseId: string) => void;
  onGuide: (useCaseId: string) => void;
  onToggleFavorite: (useCaseId: string) => void;
}

const UseCaseCard = ({ useCase, isFavorite = false, onAccess, onGuide, onToggleFavorite }: UseCaseCardProps) => {
  return (
    <div className="bg-white rounded-lg border-2 border-red-600 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-2xl">{useCase.icon || '🤖'}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{useCase.name}</h3>
            </div>
          </div>
          
          <button
            onClick={() => onToggleFavorite(useCase.id)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'text-red-600 hover:text-red-700 bg-red-50' 
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {useCase.description}
        </p>
      </div>

      {/* Card Actions */}
      <div className="px-6 pb-6 flex space-x-3">
        <button
          onClick={() => onGuide(useCase.id)}
          className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-red-600 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors"
        >
          Guide {'>'}
        </button>
        
        <button
          onClick={() => onAccess(useCase.id)}
          className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Utiliser {'>'}
        </button>
      </div>
    </div>
  );
};

export default UseCaseCard;
