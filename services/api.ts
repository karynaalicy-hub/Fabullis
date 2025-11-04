const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper para fazer requisições
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || 'Erro na requisição');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  register: async (nome_usuario: string, email: string, password: string, role: string = 'user') => {
    const data = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nome_usuario, email, password, role }),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  getMe: async () => {
    return fetchAPI('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Stories API
export const storiesAPI = {
  getAll: async (params: {
    idioma?: string;
    genero?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return fetchAPI(`/stories?${queryParams.toString()}`);
  },

  getById: async (id: number) => {
    return fetchAPI(`/stories/${id}`);
  },

  create: async (storyData: any) => {
    return fetchAPI('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  },

  update: async (id: number, storyData: any) => {
    return fetchAPI(`/stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(storyData),
    });
  },

  delete: async (id: number) => {
    return fetchAPI(`/stories/${id}`, {
      method: 'DELETE',
    });
  },

  toggleLike: async (id: number) => {
    return fetchAPI(`/stories/${id}/like`, {
      method: 'POST',
    });
  },

  toggleFollow: async (id: number) => {
    return fetchAPI(`/stories/${id}/follow`, {
      method: 'POST',
    });
  },

  getByAuthor: async (authorId: number) => {
    return fetchAPI(`/stories/author/${authorId}`);
  },
};

// Chapters API
export const chaptersAPI = {
  getById: async (id: number) => {
    return fetchAPI(`/chapters/${id}`);
  },

  getByStory: async (storyId: number) => {
    return fetchAPI(`/chapters/story/${storyId}`);
  },

  create: async (chapterData: any) => {
    return fetchAPI('/chapters', {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  },

  update: async (id: number, chapterData: any) => {
    return fetchAPI(`/chapters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chapterData),
    });
  },

  delete: async (id: number) => {
    return fetchAPI(`/chapters/${id}`, {
      method: 'DELETE',
    });
  },

  toggleLike: async (id: number) => {
    return fetchAPI(`/chapters/${id}/like`, {
      method: 'POST',
    });
  },

  getComments: async (id: number) => {
    return fetchAPI(`/chapters/${id}/comments`);
  },

  addComment: async (id: number, content: string) => {
    return fetchAPI(`/chapters/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

// Store API
export const storeAPI = {
  getPlans: async () => {
    return fetchAPI('/store/plans');
  },

  subscribe: async (planId: number) => {
    return fetchAPI('/store/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },

  checkSubscription: async () => {
    return fetchAPI('/store/subscription/check');
  },

  getProducts: async () => {
    return fetchAPI('/store/products');
  },

  getProductById: async (id: number) => {
    return fetchAPI(`/store/products/${id}`);
  },

  createSale: async (items: any[]) => {
    return fetchAPI('/store/sales', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  getMySales: async () => {
    return fetchAPI('/store/sales/my');
  },
};

// Genres API
export const genresAPI = {
  getAll: async () => {
    return fetchAPI('/genres');
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File, type: 'covers' | 'avatars' = 'covers') => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro no upload' }));
      throw new Error(error.error || 'Erro no upload');
    }

    return response.json();
  },
};
