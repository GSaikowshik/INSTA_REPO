import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const clerkToken = document.cookie.includes('__session') || Boolean(window.Clerk?.user);

  if (!token && !clerkToken) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
