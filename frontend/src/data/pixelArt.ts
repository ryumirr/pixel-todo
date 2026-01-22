import { FrameTheme } from '@/types';

// 5x5 픽셀 아트 데이터 (테마별)
export const PIXEL_ART_DATA: Record<FrameTheme, string[][]> = {
  flower: [
    ['#f0f0f0', '#ff9999', '#ff6666', '#ff9999', '#f0f0f0'],
    ['#ff9999', '#ffcc00', '#ffcc00', '#ffcc00', '#ff9999'],
    ['#ff6666', '#ffcc00', '#ff4444', '#ffcc00', '#ff6666'],
    ['#ff9999', '#ffcc00', '#ffcc00', '#ffcc00', '#ff9999'],
    ['#f0f0f0', '#66cc66', '#66cc66', '#66cc66', '#f0f0f0'],
  ],
  city: [
    ['#87ceeb', '#87ceeb', '#ffdd44', '#87ceeb', '#87ceeb'],
    ['#87ceeb', '#666666', '#888888', '#666666', '#87ceeb'],
    ['#888888', '#666666', '#888888', '#666666', '#888888'],
    ['#888888', '#ffff99', '#888888', '#ffff99', '#888888'],
    ['#555555', '#555555', '#555555', '#555555', '#555555'],
  ],
  space: [
    ['#0a0a2e', '#ffffff', '#0a0a2e', '#0a0a2e', '#ffffff'],
    ['#0a0a2e', '#0a0a2e', '#0a0a2e', '#ffff66', '#0a0a2e'],
    ['#0a0a2e', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#0a0a2e'],
    ['#0a0a2e', '#ff6b6b', '#ffcc00', '#ff6b6b', '#0a0a2e'],
    ['#ffffff', '#0a0a2e', '#ff6b6b', '#0a0a2e', '#ffffff'],
  ],
  cat: [
    ['#f0f0f0', '#ffa07a', '#ffa07a', '#ffa07a', '#f0f0f0'],
    ['#ffa07a', '#ffd700', '#ffa07a', '#ffd700', '#ffa07a'],
    ['#ffa07a', '#ffa07a', '#ff6b6b', '#ffa07a', '#ffa07a'],
    ['#ffa07a', '#333333', '#ffa07a', '#333333', '#ffa07a'],
    ['#f0f0f0', '#ffa07a', '#ffa07a', '#ffa07a', '#f0f0f0'],
  ],
  mountain: [
    ['#87ceeb', '#87ceeb', '#ffffff', '#87ceeb', '#87ceeb'],
    ['#87ceeb', '#ffffff', '#aaaaaa', '#ffffff', '#87ceeb'],
    ['#87ceeb', '#aaaaaa', '#888888', '#aaaaaa', '#87ceeb'],
    ['#228b22', '#888888', '#888888', '#888888', '#228b22'],
    ['#228b22', '#228b22', '#228b22', '#228b22', '#228b22'],
  ],
  ocean: [
    ['#87ceeb', '#87ceeb', '#ffdd44', '#87ceeb', '#87ceeb'],
    ['#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9'],
    ['#3a7fc9', '#ffcc66', '#3a7fc9', '#3a7fc9', '#3a7fc9'],
    ['#2a6eb9', '#2a6eb9', '#2a6eb9', '#ff6b6b', '#2a6eb9'],
    ['#1a5da9', '#1a5da9', '#1a5da9', '#1a5da9', '#1a5da9'],
  ],
};

// 테마 순서 (레벨별)
export const THEME_ORDER: FrameTheme[] = [
  'flower',
  'cat',
  'mountain',
  'city',
  'ocean',
  'space',
];

// 테마별 이름
export const THEME_NAMES: Record<FrameTheme, string> = {
  flower: '봄 꽃',
  cat: '귀여운 고양이',
  mountain: '설산',
  city: '도시 야경',
  ocean: '바다와 석양',
  space: '우주 로켓',
};

// 미완성 상태 색상 (흐릿한 회색)
export const UNFILLED_COLOR = '#e5e5e5';

// 힌트 색상 (살짝 보이는 정도)
export const HINT_OPACITY = 0.15;
