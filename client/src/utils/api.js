/**
 * Centralized API configuration using environment variables
 * This ensures all API calls use the environment-based URL instead of hardcoded defaults
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * API helper function to build full API URLs
 */
export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint}`;
};

/**
 * Get common fetch headers including authorization token
 */
export const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Get API base URL (useful for debugging or advanced cases)
 */
export const getApiBaseUrl = () => {
  return API_URL;
};
