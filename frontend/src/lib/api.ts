import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API 클라이언트 설정
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 인터셉터
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 응답 인터셉터 (토큰 만료 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API 타입 정의
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Frame {
  id: string;
  userId: string;
  name: string;
  theme: string;
  level: number;
  gridSize: number;
  filledCount: number;
  totalCells: number;
  completed: boolean;
  completedAt?: string;
  imageData: string[][];
  createdAt: string;
  cells?: PixelCell[];
}

export interface PixelCell {
  id: string;
  frameId: string;
  x: number;
  y: number;
  color: string;
  filled: boolean;
  fillOrder: number;
  filledAt?: string;
}

export interface UserStats {
  id: string;
  userId: string;
  todayCompleted: number;
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
  completedFrames: number;
  updatedAt: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
};

// Todo API
export const todoAPI = {
  getTodos: async (): Promise<Todo[]> => {
    const response = await api.get('/todos');
    return response.data.data;
  },

  createTodo: async (text: string): Promise<Todo> => {
    const response = await api.post('/todos', { text });
    return response.data.data;
  },

  updateTodo: async (id: string, completed: boolean): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, { completed });
    return response.data.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};

// Frame API
export const frameAPI = {
  getCurrentFrame: async (): Promise<Frame> => {
    const response = await api.get('/frames/current');
    return response.data.data;
  },

  fillNextCell: async (): Promise<Frame> => {
    const response = await api.post('/frames/fill-cell');
    return response.data.data;
  },

  getGallery: async () => {
    const response = await api.get('/frames/gallery');
    return response.data.data;
  },
};

// Stats API
export const statsAPI = {
  getStats: async (): Promise<UserStats> => {
    const response = await api.get('/stats');
    return response.data.data;
  },
};

export default api;