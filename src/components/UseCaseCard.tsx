
import React from 'react';
import { ExternalLink, BookOpen, Heart, BarChart3, Brain, FileText, Zap, Database } from 'lucide-react';
import { UseCaseSummary } from '../services/api';

interface UseCaseCardProps {
  useCase: UseCaseSummary;
  isFavorite?: boolean;
  onAccess: (useCaseId: string) => void;
  onGuide: (useCaseId: string) => void;
  onToggleFavorite: (useCaseId: string) => void;
}

const iconMap = {
  'analytics': BarChart3,
  'ai': Brain,
  'document': FileText,
  'automation': Zap,
  'database': Database,
  'default': Brain
};

const UseCaseCard = ({ useCase, isFavorite = false, onAccess, onGuide, onToggleFavorite }: UseCaseCardProps) => {
  const IconComponent = iconMap[useCase.icon as keyof typeof iconMap] || iconMap.default;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      case 'deprecated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{useCase.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(useCase.status)}`}>
                {useCase.status}
              </span>
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

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {useCase.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="bg-gray-100 px-2 py-1 rounded">
            Scope: {useCase.scope}
          </span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="bg-gray-50 px-6 py-4 flex space-x-3">
        <button
          onClick={() => onGuide(useCase.id)}
          className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Guide
        </button>
        
        <button
          onClick={() => onAccess(useCase.id)}
          className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Access Tool
        </button>
      </div>
    </div>
  );
};

export default UseCaseCard;
