
import React from 'react';
import { Shield, Users, Lock, AlertCircle } from 'lucide-react';
import Header from '../components/Header';

const PolitiqueIA = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique d'Intelligence Artificielle</h1>
          <p className="text-gray-600">Notre engagement envers une IA responsable et éthique</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="space-y-8">
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Principes Fondamentaux</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Chez GAÏA, nous nous engageons à développer et déployer l'intelligence artificielle de manière responsable, 
                transparente et éthique. Nos systèmes d'IA sont conçus pour augmenter les capacités humaines tout en 
                respectant la dignité et les droits de tous les utilisateurs.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Équité et Non-Discrimination</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Nous nous efforçons d'éliminer les biais dans nos modèles d'IA et de garantir un traitement équitable 
                pour tous les utilisateurs, indépendamment de leur origine, genre, âge ou autres caractéristiques personnelles.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Protection des Données</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                La confidentialité des données est au cœur de notre approche. Nous appliquons des mesures de sécurité 
                strictes et ne partageons jamais vos données personnelles sans votre consentement explicite.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Transparence et Contrôle</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Nous nous engageons à fournir des explications claires sur le fonctionnement de nos systèmes d'IA 
                et à donner aux utilisateurs le contrôle sur leurs interactions avec ces technologies.
              </p>
            </section>

            <section className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
              <p className="text-gray-700">
                Pour toute question concernant notre politique d'IA ou pour signaler un problème, 
                contactez notre équipe éthique IA à : <span className="text-red-600 font-medium">ethique@gaia.com</span>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PolitiqueIA;
