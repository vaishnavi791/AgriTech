import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PredictionProvider } from './context/PredictionContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import AppRoutes from './routes/AppRoutes';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <PredictionProvider>
            <div className="flex flex-col min-h-screen bg-cream-100 text-earth-dark font-sans selection:bg-sage-200 selection:text-agri-900">
              {/* Top Navigation */}
              <Navbar />

              {/* Main Page Content */}
              <main className="flex-1">
                <AppRoutes />
              </main>

              {/* Floating AI Chatbot Assistant */}
              <Chatbot />

              {/* Traditional Grounded Site Footer */}
              <Footer />
            </div>
          </PredictionProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
