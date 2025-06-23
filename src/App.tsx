
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './hooks/useAuth';
import { FeatureFlagsProvider } from './hooks/useFeatureFlags';
import { useAuth } from './hooks/useAuth';
import Index from './pages/Index';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Actualites from './pages/Actualites';
import PolitiqueIA from './pages/PolitiqueIA';
import Formations from './pages/Formations';
import Contact from './pages/Contact';
import Aide from './pages/Aide';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <FeatureFlagsProvider isAdmin={isAdmin}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/politique-ia" element={<PolitiqueIA />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/aide" element={<Aide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </FeatureFlagsProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
