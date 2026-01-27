// app/utils/api.js

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Function to get token from cookies
const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  // Try to get token from cookies
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token' || name === 'accessToken') {
      return value;
    }
  }
  
  // Try localStorage as fallback
  return localStorage.getItem('token') || localStorage.getItem('accessToken');
};

// Function to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic fetch function
const fetchWithAuth = async (url, options = {}) => {
  const authHeaders = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  // If 401, redirect to login
  if (response.status === 401) {
    console.warn('Authentication failed, redirecting to login...');
    
    // Clear tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    // Redirect
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  return response;
};

// API instance
export const api = {
  get: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetchWithAuth(url, {
        method: 'GET',
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      
      if (error.message.includes('Authentication required')) {
        throw new Error('Please login to access this resource');
      }
      
      throw error;
    }
  },

  post: async (endpoint, data = {}, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  },

  put: async (endpoint, data = {}, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetchWithAuth(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  },

  delete: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetchWithAuth(url, {
        method: 'DELETE',
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  },
};

// API endpoints
export const API_ENDPOINTS = {
  SHEDS: '/sheds',
  SHED_BY_ID: (id) => `/sheds/${id}`,
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  USER_PROFILE: '/user/me',
};