import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireKyc = false }) => {
  const { isAuthenticated, isKycVerified, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireKyc && !isKycVerified) {
    return <Navigate to="/kyc" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
