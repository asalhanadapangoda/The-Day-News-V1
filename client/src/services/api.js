const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Base fetch function
const fetchAPI = async (endpoint, options = {}, skipJsonStringify = false) => {
  const token = getToken();
  const config = {
    headers: {
      ...options.headers,
    },
    ...options,
  };

  // Only set Content-Type for JSON, not for FormData
  if (!skipJsonStringify && !(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Stringify body only if not FormData and not already stringified
  if (!skipJsonStringify && options.body && !(options.body instanceof FormData) && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'An error occurred');
    }

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (username, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getMe: () => fetchAPI('/auth/me'),
};

// Podcast API
export const podcastAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/podcasts?${queryString}`);
  },
  getById: (id) => fetchAPI(`/podcasts/${id}`),
  getLatest: () => fetchAPI('/podcasts/latest'),
  getFeatured: (limit = 3) => fetchAPI(`/podcasts/featured?limit=${limit}`),
  getRelated: (id) => fetchAPI(`/podcasts/${id}/related`),
  // Admin routes
  create: (data, file = null) => {
    if (file) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('thumbnail', file);
      Object.keys(data).forEach(key => {
        if (key !== 'thumbnail' && data[key] !== undefined && data[key] !== null && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });
      return fetchAPI('/podcasts', {
        method: 'POST',
        headers: {}, // Don't set Content-Type, let browser set it with boundary
        body: formData,
      }, true); // Pass true to skip JSON.stringify
    } else {
      return fetchAPI('/podcasts', {
        method: 'POST',
        body: data, // Will be stringified in fetchAPI
      });
    }
  },
  update: (id, data, file = null) => {
    if (file) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('thumbnail', file);
      Object.keys(data).forEach(key => {
        if (key !== 'thumbnail' && data[key] !== undefined && data[key] !== null && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });
      return fetchAPI(`/podcasts/${id}`, {
        method: 'PUT',
        headers: {}, // Don't set Content-Type, let browser set it with boundary
        body: formData,
      }, true); // Pass true to skip JSON.stringify
    } else {
      return fetchAPI(`/podcasts/${id}`, {
        method: 'PUT',
        body: data, // Will be stringified in fetchAPI
      });
    }
  },
  delete: (id) =>
    fetchAPI(`/podcasts/${id}`, {
      method: 'DELETE',
    }),
  getAllAdmin: () => fetchAPI('/podcasts/admin/all'),
};

// Section API
export const sectionAPI = {
  getAll: () => fetchAPI('/sections'),
  create: (data) =>
    fetchAPI('/sections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/sections/${id}`, {
      method: 'DELETE',
    }),
};

// Upcoming API
export const upcomingAPI = {
  getAll: () => fetchAPI('/upcoming'),
  create: (data) =>
    fetchAPI('/upcoming', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/upcoming/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/upcoming/${id}`, {
      method: 'DELETE',
    }),
};

// Article API
export const articleAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/articles?${queryString}`);
  },
  getById: (id) => fetchAPI(`/articles/${id}`),
  // Admin routes
  create: (data, file = null) => {
    if (file) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('photo', file);
      Object.keys(data).forEach(key => {
        if (key !== 'photo' && data[key] !== undefined && data[key] !== null && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });
      return fetchAPI('/articles', {
        method: 'POST',
        headers: {}, // Don't set Content-Type, let browser set it with boundary
        body: formData,
      }, true); // Pass true to skip JSON.stringify
    } else {
      return fetchAPI('/articles', {
        method: 'POST',
        body: data, // Will be stringified in fetchAPI
      });
    }
  },
  update: (id, data, file = null) => {
    if (file) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('photo', file);
      Object.keys(data).forEach(key => {
        if (key !== 'photo' && data[key] !== undefined && data[key] !== null && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });
      return fetchAPI(`/articles/${id}`, {
        method: 'PUT',
        headers: {}, // Don't set Content-Type, let browser set it with boundary
        body: formData,
      }, true); // Pass true to skip JSON.stringify
    } else {
      return fetchAPI(`/articles/${id}`, {
        method: 'PUT',
        body: data, // Will be stringified in fetchAPI
      });
    }
  },
  delete: (id) =>
    fetchAPI(`/articles/${id}`, {
      method: 'DELETE',
    }),
  getAllAdmin: () => fetchAPI('/articles/admin/all'),
};

// Article Section API
export const articleSectionAPI = {
  getAll: () => fetchAPI('/article-sections'),
  create: (data) =>
    fetchAPI('/article-sections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/article-sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/article-sections/${id}`, {
      method: 'DELETE',
    }),
};

export default API_URL;

