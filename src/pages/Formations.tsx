
import React from 'react';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import Header from '../components/Header';

const Formations = () => {
  const formations = [
    {
      id: 1,
      title: "Introduction à l'Intelligence Artificielle",
      description: "Découvrez les concepts fondamentaux de l'IA et ses applications pratiques.",
      duration: "4 heures",
      level: "Débutant",
      participants: 156,
      rating: 4.8
    },
    {
      id: 2,
      title: "Utilisation Avancée des Outils GAÏA",
      description: "Maîtrisez les fonctionnalités avancées de notre plateforme pour optimiser votre productivité.",
      duration: "6 heures",
      level: "Intermédiaire",
      participants: 89,
      rating: 4.9
    },
    {
      id: 3,
      title: "IA Éthique et Responsable",
      description: "Apprenez les bonnes pratiques pour une utilisation éthique de l'intelligence artificielle.",
      duration: "3 heures",
      level: "Tous niveaux",
      participants: 234,
      rating: 4.7
    },
    {
      id: 4,
      title: "Automatisation des Tâches avec l'IA",
      description: "Découvrez comment automatiser vos processus métier grâce à l'intelligence artificielle.",
      duration: "5 heures",
      level: "Avancé",
      participants: 67,
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Formations</h1>
          <p className="text-gray-600">Développez vos compétences en intelligence artificielle avec nos formations spécialisées</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formations.map((formation) => (
            <div key={formation.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{formation.title}</h3>
                <p className="text-gray-600 leading-relaxed">{formation.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{formation.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{formation.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{formation.participants} participants</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-gray-700">{formation.rating}/5</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                  S'inscrire
                </button>
                <button className="flex-1 border border-red-600 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors">
                  En savoir plus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Formations;
