// TODO 아이템 타입
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

// 액자의 각 픽셀 셀
export interface PixelCell {
  x: number;
  y: number;
  color: string;
  filled: boolean;
  order: number; // 색칠 순서 (랜덤/순차에 사용)
}

// 액자(그림) 데이터
export interface Frame {
  id: string;
  name: string;
  theme: FrameTheme;
  gridSize: number; // 5x5 = 25칸
  cells: PixelCell[];
  filledCount: number;
  totalCells: number;
  completed: boolean;
  completedAt?: number;
  imageData: string[][]; // 완성 시 보여줄 픽셀 아트 색상
}

// 액자 테마
export type FrameTheme = 'flower' | 'city' | 'space' | 'cat' | 'mountain' | 'ocean';

// 색칠 모드
export type FillMode = 'random' | 'sequential';

// 갤러리 아이템 (완성된 액자)
export interface GalleryItem {
  id: string;
  frameId: string;
  name: string;
  theme: FrameTheme;
  completedAt: number;
  imageData: string[][];
}

// 통계 데이터
export interface Stats {
  todayCompleted: number;
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  completedFrames: number;
}

// 앱 전체 상태
export interface AppState {
  todos: Todo[];
  currentFrame: Frame;
  currentLevel: number;
  gallery: GalleryItem[];
  stats: Stats;
  fillMode: FillMode;
}

// 로컬 저장소 키
export const STORAGE_KEYS = {
  TODOS: 'pixel-todo-todos',
  CURRENT_FRAME: 'pixel-todo-current-frame',
  CURRENT_LEVEL: 'pixel-todo-current-level',
  GALLERY: 'pixel-todo-gallery',
  STATS: 'pixel-todo-stats',
  FILL_MODE: 'pixel-todo-fill-mode',
} as const;
