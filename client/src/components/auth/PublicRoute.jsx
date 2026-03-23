import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { isSessionExpired, clearSession } from '../../utils/auth';
import LoadingSpinner from '../common/LoadingSpinner';

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    // No token - allow access to login page
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Check if session expired
    if (isSessionExpired()) {
      clearSession();
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      // Verify token is valid
      const userData = await authAPI.getMe();
      
      // Check if user is admin
      if (userData && userData.role === 'admin') {
        setIsAuthenticated(true);
      } else {
        // User exists but is not admin - remove token
        clearSession();
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Token is invalid or server unavailable
      clearSession();
      setIsAuthenticated(false);
      
      // Don't log errors for missing tokens - that's expected
      if (error.message && !error.message.includes('Cannot connect')) {
        console.warn('Auth verification failed:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // If already authenticated as admin, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Not authenticated - show login page
  return children;
};

export default PublicRoute;

