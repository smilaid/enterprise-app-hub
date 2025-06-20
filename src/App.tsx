
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Actualites from "./pages/Actualites";
import PolitiqueIA from "./pages/PolitiqueIA";
import Formations from "./pages/Formations";
import Contact from "./pages/Contact";
import Aide from "./pages/Aide";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import authData from "./mock/authData.json";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(() => {
    // Get the user from localStorage if available, otherwise default to first user
    const storedUserId = localStorage.getItem('mockUserId');
    return authData.users.find(user => user.id === storedUserId) || authData.users[0];
  });
  
  const { isAuthenticated } = useAuth();

  // Update localStorage when user changes (for mock auth)
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem('mockUserId', selectedUser.id);
    }
  }, [selectedUser]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/actualites" element={<Actualites />} />
      <Route path="/politique-ia" element={<PolitiqueIA />} />
      <Route path="/formations" element={<Formations />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/aide" element={<Aide />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
