import { Frame, PixelCell, FrameTheme, FillMode } from '@/types';
import { PIXEL_ART_DATA, THEME_ORDER, THEME_NAMES, UNFILLED_COLOR } from '@/data/pixelArt';

// UUID 생성
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// 새 액자 생성
export const createFrame = (level: number): Frame => {
  const themeIndex = level % THEME_ORDER.length;
  const theme = THEME_ORDER[themeIndex];
  const gridSize = 5;
  const totalCells = gridSize * gridSize;
  const imageData = PIXEL_ART_DATA[theme];

  // 셀 배열 생성 (순서는 왼쪽 위에서 오른쪽 아래로)
  const cells: PixelCell[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      cells.push({
        x,
        y,
        color: imageData[y][x],
        filled: false,
        order: y * gridSize + x,
      });
    }
  }

  return {
    id: generateId(),
    name: THEME_NAMES[theme],
    theme,
    gridSize,
    cells,
    filledCount: 0,
    totalCells,
    completed: false,
    imageData,
  };
};

// 셀 색칠 순서 섞기 (랜덤 모드용)
export const shuffleFillOrder = (frame: Frame): Frame => {
  const shuffledOrders = [...Array(frame.totalCells).keys()];

  // Fisher-Yates 셔플
  for (let i = shuffledOrders.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOrders[i], shuffledOrders[j]] = [shuffledOrders[j], shuffledOrders[i]];
  }

  const newCells = frame.cells.map((cell, index) => ({
    ...cell,
    order: shuffledOrders[index],
  }));

  return {
    ...frame,
    cells: newCells,
  };
};

// 다음에 색칠할 셀 찾기
export const getNextCellToFill = (frame: Frame, mode: FillMode): PixelCell | null => {
  const unfilledCells = frame.cells.filter(cell => !cell.filled);

  if (unfilledCells.length === 0) return null;

  if (mode === 'sequential') {
    // 순차: order가 가장 작은 것
    return unfilledCells.reduce((min, cell) =>
      cell.order < min.order ? cell : min
    );
  } else {
    // 랜덤: order가 가장 작은 것 (이미 섞여있으므로)
    return unfilledCells.reduce((min, cell) =>
      cell.order < min.order ? cell : min
    );
  }
};

// 셀 색칠
export const fillNextCell = (frame: Frame, mode: FillMode): { frame: Frame; filledCell: PixelCell | null } => {
  const cellToFill = getNextCellToFill(frame, mode);

  if (!cellToFill) {
    return { frame, filledCell: null };
  }

  const newCells = frame.cells.map(cell =>
    cell.x === cellToFill.x && cell.y === cellToFill.y
      ? { ...cell, filled: true }
      : cell
  );

  const newFilledCount = frame.filledCount + 1;
  const completed = newFilledCount === frame.totalCells;

  return {
    frame: {
      ...frame,
      cells: newCells,
      filledCount: newFilledCount,
      completed,
      completedAt: completed ? Date.now() : undefined,
    },
    filledCell: cellToFill,
  };
};

// 진행률 계산
export const getProgress = (frame: Frame): number => {
  return Math.round((frame.filledCount / frame.totalCells) * 100);
};

// 오늘 날짜 문자열 (YYYY-MM-DD)
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 어제 날짜 문자열
export const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};
