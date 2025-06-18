
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users, Activity, DollarSign, Leaf } from 'lucide-react';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { logger, LogCategory } from '../utils/logger';

const Dashboard = () => {
  const { user, logout } = useAuth();

  // Fetch global metrics for admin
  const { data: globalMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['global-metrics'],
    queryFn: () => apiService.getGlobalMetrics(),
    enabled: !!user && (user.role === 'admin'),
  });

  // Fetch use case usage statistics
  const { data: usageStats, isLoading: isLoadingUsage } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => apiService.getUseCaseUsageStats(),
    enabled: !!user && (user.role === 'admin'),
  });

  if (!user || user.role !== 'admin') {
    logger.warn(LogCategory.ACCESS_DENIED, 'Non-admin user attempted to access dashboard');
    return (
      <div className="min-h-screen bg-gray-100">
        <Header user={user} onLogout={logout} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
            <p className="text-gray-600">Vous devez être administrateur pour accéder à cette page.</p>
          </div>
        </div>
      </div>
    );
  }

  logger.debug(LogCategory.UI, 'Rendering admin dashboard', { userId: user.id });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={logout} />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord <span className="text-red-600">Administrateur</span>
          </h1>
          <p className="text-gray-600">Vue d'ensemble des métriques globales</p>
        </div>

        {/* Global Metrics Cards */}
        {isLoadingMetrics ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : globalMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Requêtes totales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {globalMetrics.totalRequests.toLocaleString()}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tokens utilisés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {globalMetrics.totalTokens.toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Coût total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{globalMetrics.totalCost.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Impact CO₂</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {globalMetrics.carbonImpact.toFixed(4)} kg
                  </p>
                </div>
                <Leaf className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        )}

        {/* Use Case Usage Statistics */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Statistiques d'utilisation des cas d'usage
          </h2>
          
          {isLoadingUsage ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : usageStats && usageStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cas d'usage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Utilisations</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tokens</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Coût</th>
                  </tr>
                </thead>
                <tbody>
                  {usageStats.map((stat) => (
                    <tr key={stat.useCaseId} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="mr-2">{stat.icon}</span>
                          {stat.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">{stat.usageCount}</td>
                      <td className="py-3 px-4">{stat.totalTokens.toLocaleString()}</td>
                      <td className="py-3 px-4">€{stat.totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune statistique d'utilisation disponible
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
