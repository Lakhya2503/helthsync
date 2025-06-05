import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user?.email) {
    console.log('No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;