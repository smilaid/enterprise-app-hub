
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, HelpCircle, Mail, Phone } from 'lucide-react';
import Header from '../components/Header';

const Aide = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      id: 1,
      question: "Comment créer un compte sur la plateforme GAÏA ?",
      answer: "Pour créer un compte, cliquez sur le bouton 'S'inscrire' en haut à droite de la page d'accueil. Remplissez le formulaire avec vos informations personnelles et suivez les instructions envoyées par email pour valider votre compte."
    },
    {
      id: 2,
      question: "Comment utiliser les outils d'intelligence artificielle ?",
      answer: "Une fois connecté, accédez à la section 'Vos Assistants' sur la page d'accueil. Chaque outil dispose d'un bouton 'Guide' qui vous expliquera son utilisation et d'un bouton 'Utiliser' pour y accéder directement."
    },
    {
      id: 3,
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, nous appliquons les plus hauts standards de sécurité. Toutes vos données sont chiffrées et nous respectons strictement notre politique de confidentialité. Consultez notre page 'Politique IA' pour plus de détails."
    },
    {
      id: 4,
      question: "Comment puis-je signaler un problème technique ?",
      answer: "Vous pouvez signaler un problème via la page Contact en sélectionnant 'Signaler un problème' dans le type de demande, ou utiliser le chat en direct disponible 24h/7j."
    },
    {
      id: 5,
      question: "Les formations sont-elles gratuites ?",
      answer: "Certaines formations de base sont gratuites pour tous les utilisateurs. Les formations avancées peuvent nécessiter un abonnement premium. Consultez la page Formations pour plus de détails."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centre d'Aide</h1>
          <p className="text-gray-600">Trouvez rapidement les réponses à vos questions</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-red-600" />
                <span>Questions Fréquentes</span>
              </h2>
              
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {openFaq === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {openFaq === faq.id && (
                      <div className="px-4 pb-3 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune question trouvée pour "{searchTerm}"
                </div>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Besoin d'aide supplémentaire ?</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@gaia.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Téléphone</p>
                    <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors">
                Contacter le Support
              </button>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Guides d'utilisation</h3>
              <p className="text-gray-700 text-sm mb-4">
                Consultez nos guides détaillés pour maîtriser tous les aspects de la plateforme.
              </p>
              <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
                Voir les guides {'>'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Aide;
