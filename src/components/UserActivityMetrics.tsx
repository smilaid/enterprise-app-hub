
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Zap, DollarSign, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from './LoadingSpinner';
import { apiService } from '../services/api';
import { logger, LogCategory } from '../utils/logger';

interface UserActivityMetricsProps {
  userId: string;
}

const UserActivityMetrics = ({ userId }: UserActivityMetricsProps) => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['user-activity-metrics', userId],
    queryFn: () => apiService.getUserActivityMetrics(userId),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  logger.debug(LogCategory.UI, 'Rendering user activity metrics', { userId, isLoading });

  if (isLoading) {
    return (
      <Card className="w-80 border-red-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Activité Utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-4">
          <LoadingSpinner size="sm" />
        </CardContent>
      </Card>
    );
  }

  if (error || !metrics) {
    logger.warn(LogCategory.UI, 'Failed to load user activity metrics', { error, userId });
    return (
      <Card className="w-80 border-red-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Activité Utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">Données indisponibles</p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => `${amount.toFixed(2)}€`;
  const formatCarbon = (kg: number) => `${(kg * 1000).toFixed(0)}g`;

  return (
    <Card className="w-80 border-red-100 bg-gradient-to-br from-white to-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Activity className="h-4 w-4 text-red-600" aria-hidden="true" />
          Activité Utilisateur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Requests */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
            <span className="text-xs text-gray-600">Requêtes</span>
          </div>
          <span className="text-sm font-semibold text-gray-900" aria-label={`${metrics.totalRequests} requêtes effectuées`}>
            {formatNumber(metrics.totalRequests)}
          </span>
        </div>

        {/* Tokens */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-yellow-500" aria-hidden="true" />
            <span className="text-xs text-gray-600">Tokens</span>
          </div>
          <span className="text-sm font-semibold text-gray-900" aria-label={`${metrics.totalTokens} tokens consommés`}>
            {formatNumber(metrics.totalTokens)}
          </span>
        </div>

        {/* Cost */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-green-500" aria-hidden="true" />
            <span className="text-xs text-gray-600">Coût</span>
          </div>
          <span className="text-sm font-semibold text-gray-900" aria-label={`Coût total de ${formatCurrency(metrics.totalCost)}`}>
            {formatCurrency(metrics.totalCost)}
          </span>
        </div>

        {/* CO2 Impact */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-3 w-3 text-orange-500 rotate-45" aria-hidden="true" />
            <span className="text-xs text-gray-600">CO₂</span>
          </div>
          <span className="text-sm font-semibold text-gray-900" aria-label={`Impact carbone de ${formatCarbon(metrics.carbonImpact)}`}>
            {formatCarbon(metrics.carbonImpact)}
          </span>
        </div>

        <div className="pt-2 border-t border-red-100">
          <p className="text-xs text-gray-500 text-center">
            Données du mois en cours
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityMetrics;
