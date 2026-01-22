// API 타입 정의
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface PixelCell {
  id: string;
  frameId: string;
  x: number;
  y: number;
  color: string;
  filled: boolean;
  fillOrder: number;
  filledAt?: Date;
}

export interface Frame {
  id: string;
  userId: string;
  name: string;
  theme: FrameTheme;
  level: number;
  gridSize: number;
  filledCount: number;
  totalCells: number;
  completed: boolean;
  completedAt?: Date;
  imageData: string[][];
  createdAt: Date;
  cells?: PixelCell[];
}

export interface GalleryItem {
  id: string;
  userId: string;
  frameId: string;
  name: string;
  theme: FrameTheme;
  completedAt: Date;
  imageData: string[][];
}

export interface UserStats {
  id: string;
  userId: string;
  todayCompleted: number;
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: Date;
  completedFrames: number;
  updatedAt: Date;
}

export type FrameTheme = 'flower' | 'city' | 'space' | 'cat' | 'mountain' | 'ocean';
export type FillMode = 'random' | 'sequential';

// API 요청/응답 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  completed: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}