
import React from 'react';
import { Calendar, User } from 'lucide-react';
import Header from '../components/Header';

const Actualites = () => {
  const articles = [
    {
      id: 1,
      title: "Nouvelle mise à jour de la plateforme GAÏA",
      excerpt: "Découvrez les dernières fonctionnalités ajoutées à notre plateforme d'intelligence artificielle.",
      date: "2024-06-10",
      author: "Équipe GAÏA",
      readTime: "3 min"
    },
    {
      id: 2,
      title: "Guide d'utilisation des nouveaux outils IA",
      excerpt: "Un guide complet pour tirer le meilleur parti des derniers outils d'intelligence artificielle disponibles.",
      date: "2024-06-08",
      author: "Support GAÏA",
      readTime: "5 min"
    },
    {
      id: 3,
      title: "Amélioration des performances du système",
      excerpt: "Nous avons optimisé nos serveurs pour une expérience utilisateur encore plus fluide.",
      date: "2024-06-05",
      author: "Équipe Technique",
      readTime: "2 min"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Actualités</h1>
          <p className="text-gray-600">Restez informé des dernières nouveautés de la plateforme GAÏA</p>
        </div>

        <div className="space-y-6">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-red-600 cursor-pointer">
                {article.title}
              </h2>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                </div>
                <span className="text-red-600 font-medium">{article.readTime} de lecture</span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Actualites;
