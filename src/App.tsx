import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import DevEnvStatus from './components/DevEnvStatus';
import Index from './pages/Index';
import Chat from './pages/Chat';
import Laboratorio from './pages/Laboratorio';
import LaubotDemo from './pages/LaubotDemo';
import SupabaseDashboard from './pages/SupabaseDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-beige">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/laboratorio" element={<Laboratorio />} />
            <Route path="/laubot" element={<LaubotDemo />} />
            <Route path="/dashboard" element={<SupabaseDashboard />} />
          </Routes>
          <DevEnvStatus />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
