import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import OnboardingFlow from './components/OnboardingFlow';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import Index from './pages/Index';
import Chat from './pages/Chat';
import Laboratorio from './pages/Laboratorio';
import LaubotDemo from './pages/LaubotDemo';
import SupabaseDashboard from './pages/SupabaseDashboard';
import FuncionesAsistente from './pages/FuncionesAsistente';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Roadmap from './pages/Roadmap';

const AppContent = () => {
  const { shouldShowOnboarding, completeOnboarding } = useOnboarding();

  return (
    <>
      <div className="min-h-screen bg-beige flex flex-col">
        {/* Navigation Bar - Always visible except during onboarding */}
        {!shouldShowOnboarding && <NavigationBar />}
        
        {/* Main content area with proper padding for mobile */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/laboratorio" element={<Laboratorio />} />
            <Route path="/laubot" element={<LaubotDemo />} />
            <Route path="/dashboard" element={<SupabaseDashboard />} />
            <Route path="/funciones" element={<FuncionesAsistente />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </main>

        {/* Footer - Only show when not in onboarding */}
        {!shouldShowOnboarding && <Footer />}
      </div>
      
      {/* Onboarding overlay */}
      {shouldShowOnboarding && (
        <OnboardingFlow onComplete={completeOnboarding} />
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
