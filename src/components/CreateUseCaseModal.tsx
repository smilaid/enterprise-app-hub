
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { apiService } from '../services/api';
import { logger, LogCategory } from '../utils/logger';

interface CreateUseCaseModalProps {
  userId: string;
  onUseCaseCreated: () => void;
}

const CreateUseCaseModal = ({ userId, onUseCaseCreated }: CreateUseCaseModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    accessUrl: '',
    guideUrl: '',
    allowedGroups: 'users,portal-access'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast({
        title: "Erreur",
        description: "Le nom et la description sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    logger.info(LogCategory.USER_ACTION, 'Creating new use case', { userId, formData });

    try {
      await apiService.createUseCase({
        ...formData,
        ownerId: userId,
        scope: 'custom',
        status: 'active'
      });

      toast({
        title: "Cas d'usage créé",
        description: "Le nouveau cas d'usage a été créé avec succès.",
      });

      setIsOpen(false);
      setFormData({
        name: '',
        icon: '',
        description: '',
        accessUrl: '',
        guideUrl: '',
        allowedGroups: 'users,portal-access'
      });
      onUseCaseCreated();
    } catch (error) {
      logger.error(LogCategory.USER_ACTION, 'Failed to create use case', { error, userId });
      toast({
        title: "Erreur",
        description: "Impossible de créer le cas d'usage. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          onClick={() => logger.info(LogCategory.USER_ACTION, 'Create use case modal opened', { userId })}
        >
          <Plus className="h-4 w-4" />
          <span>Créer un cas d'usage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau cas d'usage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icône (emoji)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="🔧"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lien d'accès
            </label>
            <input
              type="url"
              name="accessUrl"
              value={formData.accessUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/tool"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lien du guide
            </label>
            <input
              type="url"
              name="guideUrl"
              value={formData.guideUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/guide"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Groupes autorisés
            </label>
            <input
              type="text"
              name="allowedGroups"
              value={formData.allowedGroups}
              onChange={handleInputChange}
              placeholder="users,portal-access"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Séparez les groupes par des virgules
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUseCaseModal;
