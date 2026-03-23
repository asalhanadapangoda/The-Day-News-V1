import { authAPI } from '../services/api';

const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds
const SESSION_START_KEY = 'sessionStartTime';

/**
 * Set session start time when user logs in
 */
export const setSessionStart = () => {
  localStorage.setItem(SESSION_START_KEY, Date.now().toString());
};

/**
 * Check if session has expired (20 minutes)
 * @returns {boolean} - True if session expired, false otherwise
 */
export const isSessionExpired = () => {
  const sessionStart = localStorage.getItem(SESSION_START_KEY);
  if (!sessionStart) {
    return true; // No session start time means expired
  }

  const sessionStartTime = parseInt(sessionStart, 10);
  const currentTime = Date.now();
  const elapsedTime = currentTime - sessionStartTime;

  return elapsedTime > SESSION_DURATION;
};

/**
 * Get remaining session time in milliseconds
 * @returns {number} - Remaining time in ms, or 0 if expired
 */
export const getRemainingSessionTime = () => {
  const sessionStart = localStorage.getItem(SESSION_START_KEY);
  if (!sessionStart) {
    return 0;
  }

  const sessionStartTime = parseInt(sessionStart, 10);
  const currentTime = Date.now();
  const elapsedTime = currentTime - sessionStartTime;
  const remaining = SESSION_DURATION - elapsedTime;

  return remaining > 0 ? remaining : 0;
};

/**
 * Clear session data (logout)
 */
export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem(SESSION_START_KEY);
};

/**
 * Check if user is authenticated by validating token with backend
 * @returns {Promise<boolean>} - True if authenticated, false otherwise
 */
export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }

  // Check if session expired
  if (isSessionExpired()) {
    clearSession();
    return false;
  }

  try {
    await authAPI.getMe();
    return true;
  } catch (error) {
    // Token is invalid or expired
    clearSession();
    return false;
  }
};

/**
 * Get authentication token
 * @returns {string|null} - Token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Remove authentication token (logout)
 */
export const removeToken = () => {
  clearSession();
};

/**
 * Set authentication token and start session
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
  setSessionStart();
};

