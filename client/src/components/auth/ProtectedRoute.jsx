import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { isSessionExpired, clearSession, getRemainingSessionTime } from '../../utils/auth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const location = useLocation();

  useEffect(() => {
    verifyAuth();
    
    // Check session expiration every minute
    const sessionCheckInterval = setInterval(() => {
      if (isSessionExpired()) {
        handleSessionExpired();
      }
    }, 60 * 1000); // Check every minute

    // Set up auto-logout timer based on remaining session time
    const remainingTime = getRemainingSessionTime();
    let logoutTimer;
    
    if (remainingTime > 0) {
      logoutTimer = setTimeout(() => {
        handleSessionExpired();
      }, remainingTime);
    }

    // Re-verify on route change
    const verifyInterval = setInterval(() => {
      verifyAuth();
    }, 5 * 60 * 1000); // Re-verify every 5 minutes

    return () => {
      clearInterval(sessionCheckInterval);
      clearInterval(verifyInterval);
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [location.pathname]);

  const handleSessionExpired = () => {
    clearSession();
    setSessionExpired(true);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const verifyAuth = async () => {
    const token = localStorage.getItem('token');
    
    // No token - immediately redirect to login
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Check if session expired
    if (isSessionExpired()) {
      handleSessionExpired();
      return;
    }

    try {
      // Verify token is valid by calling the API
      const userData = await authAPI.getMe();
      
      // Additional check: ensure user is admin
      if (userData && userData.role === 'admin') {
        setIsAuthenticated(true);
        setSessionExpired(false);
      } else {
        // User is not admin - remove token and redirect
        clearSession();
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Token is invalid, expired, or server is not available
      clearSession();
      setIsAuthenticated(false);
      
      // Log error for debugging (but don't expose to user)
      if (error.message && !error.message.includes('Cannot connect')) {
        console.warn('Auth verification failed:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while verifying
  if (loading) {
    return <LoadingSpinner />;
  }

  // Not authenticated - redirect to login page
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/admin" 
        replace 
        state={{ 
          from: location.pathname,
          sessionExpired: sessionExpired 
        }} 
      />
    );
  }

  // Authenticated - render protected content
  return children;
};

export default ProtectedRoute;

