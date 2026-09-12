import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Pages
import Landing from '../pages/Landing';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CropRecommendation from '../pages/CropRecommendation/CropRecommendation';
import DiseaseDetection from '../pages/DiseaseDetection/DiseaseDetection';
import CostEstimation from '../pages/CostEstimation/CostEstimation';
import PriceForecasting from '../pages/PriceForecasting/PriceForecasting';

/**
 * Route guard component for authenticated pages.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Public route guard (redirects already logged-in users to /welcome)
 */
export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />

      {/* Auth Pages */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Authenticated Dashboard */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
      />

      {/* Five Priority Feature Routes */}
      <Route path="/crop-recommendation" element={<CropRecommendation />} />
      <Route path="/disease-detection" element={<DiseaseDetection />} />
      <Route path="/cost-estimation" element={<CostEstimation />} />
      <Route path="/price-forecasting" element={<PriceForecasting />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

