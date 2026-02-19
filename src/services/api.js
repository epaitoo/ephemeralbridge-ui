const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://yourapi.com';

async function fetchWithAuth(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    ...options.headers,
  };

  // Don't set Content-Type for FormData (let browser set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for session auth
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Files API
export const filesApi = {
  getAll: () => fetchWithAuth('/v1/files'),
  
  get: (id) => fetchWithAuth(`/v1/files/${id}`),
  
  upload: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    return fetchWithAuth('/v1/files', {
      method: 'POST',
      body: formData,
    });
  },
  
  getDownloadUrl: (id) => fetchWithAuth(`/v1/files/${id}/download`),
  
  delete: (id) => fetchWithAuth(`/v1/files/${id}`, { method: 'DELETE' }),
};

// Texts API
export const textsApi = {
  getAll: () => fetchWithAuth('/v1/texts'),
  
  get: (id) => fetchWithAuth(`/v1/texts/${id}`),
  
  create: (data) => fetchWithAuth('/v1/texts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => fetchWithAuth(`/v1/texts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => fetchWithAuth(`/v1/texts/${id}`, { method: 'DELETE' }),
};

// Auth API
export const authApi = {
  createSession: () => fetchWithAuth('/v1/auth/session', { method: 'POST' }),
  logout: () => fetchWithAuth('/v1/auth/logout', { method: 'POST' }),
};
