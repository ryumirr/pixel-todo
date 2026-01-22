import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { Frame, PixelCell, GalleryItem, ApiResponse } from '../types';
import { PIXEL_ART_DATA, THEME_ORDER, THEME_NAMES } from '../config/pixelArt';

export const getCurrentFrame = async (
  req: AuthRequest,
  res: Response<ApiResponse<Frame>>
) => {
  try {
    // 현재 사용자의 미완성 프레임 조회
    const frameResult = await pool.query(
      `SELECT id, user_id as "userId", name, theme, level, grid_size as "gridSize", 
              filled_count as "filledCount", total_cells as "totalCells", 
              completed, completed_at as "completedAt", image_data as "imageData", 
              created_at as "createdAt"
       FROM frames 
       WHERE user_id = $1 AND completed = false 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [req.userId]
    );

    let frame: Frame;

    if (frameResult.rows.length === 0) {
      // 새 프레임 생성
      frame = await createNewFrame(req.userId!);
    } else {
      frame = frameResult.rows[0];
      
      // 픽셀 셀 정보 조회
      const cellsResult = await pool.query(
        `SELECT id, frame_id as "frameId", x, y, color, filled, 
                fill_order as "fillOrder", filled_at as "filledAt"
         FROM pixel_cells 
         WHERE frame_id = $1 
         ORDER BY fill_order`,
        [frame.id]
      );
      
      frame.cells = cellsResult.rows;
    }

    res.json({
      success: true,
      data: frame
    });
  } catch (error) {
    console.error('Get current frame error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};

export const fillNextCell = async (
  req: AuthRequest,
  res: Response<ApiResponse<Frame>>
) => {
  try {
    // 현재 프레임 조회
    const frameResult = await pool.query(
      'SELECT * FROM frames WHERE user_id = $1 AND completed = false ORDER BY created_at DESC LIMIT 1',
      [req.userId]
    );

    if (frameResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '활성 프레임을 찾을 수 없습니다'
      });
    }

    const frame = frameResult.rows[0];

    // 다음 색칠할 셀 찾기
    const nextCellResult = await pool.query(
      'SELECT * FROM pixel_cells WHERE frame_id = $1 AND filled = false ORDER BY fill_order LIMIT 1',
      [frame.id]
    );

    if (nextCellResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: '색칠할 셀이 없습니다'
      });
    }

    const nextCell = nextCellResult.rows[0];

    // 셀 색칠
    await pool.query(
      'UPDATE pixel_cells SET filled = true, filled_at = CURRENT_TIMESTAMP WHERE id = $1',
      [nextCell.id]
    );

    // 프레임 진행률 업데이트
    const newFilledCount = frame.filled_count + 1;
    const isCompleted = newFilledCount >= frame.total_cells;

    await pool.query(
      'UPDATE frames SET filled_count = $1, completed = $2, completed_at = $3 WHERE id = $4',
      [newFilledCount, isCompleted, isCompleted ? new Date() : null, frame.id]
    );

    // 완성된 경우 갤러리에 추가
    if (isCompleted) {
      await pool.query(
        'INSERT INTO gallery_items (user_id, frame_id, name, theme, completed_at, image_data) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)',
        [req.userId, frame.id, frame.name, frame.theme, frame.image_data]
      );
    }

    // 업데이트된 프레임 반환
    const updatedFrameResult = await pool.query(
      `SELECT id, user_id as "userId", name, theme, level, grid_size as "gridSize", 
              filled_count as "filledCount", total_cells as "totalCells", 
              completed, completed_at as "completedAt", image_data as "imageData", 
              created_at as "createdAt"
       FROM frames WHERE id = $1`,
      [frame.id]
    );

    res.json({
      success: true,
      data: updatedFrameResult.rows[0]
    });
  } catch (error) {
    console.error('Fill next cell error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};

export const getGallery = async (
  req: AuthRequest,
  res: Response<ApiResponse<GalleryItem[]>>
) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id as "userId", frame_id as "frameId", name, theme, 
              completed_at as "completedAt", image_data as "imageData"
       FROM gallery_items 
       WHERE user_id = $1 
       ORDER BY completed_at DESC`,
      [req.userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};

// 새 프레임 생성 헬퍼 함수
async function createNewFrame(userId: string): Promise<Frame> {
  // 사용자의 현재 레벨 조회
  const levelResult = await pool.query(
    'SELECT COUNT(*) as level FROM gallery_items WHERE user_id = $1',
    [userId]
  );
  
  const level = parseInt(levelResult.rows[0].level);
  const theme = THEME_ORDER[level % THEME_ORDER.length];
  const themeName = THEME_NAMES[theme];
  const imageData = PIXEL_ART_DATA[theme];

  // 새 프레임 생성
  const frameResult = await pool.query(
    `INSERT INTO frames (user_id, name, theme, level, image_data) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, user_id as "userId", name, theme, level, grid_size as "gridSize", 
               filled_count as "filledCount", total_cells as "totalCells", 
               completed, completed_at as "completedAt", image_data as "imageData", 
               created_at as "createdAt"`,
    [userId, themeName, theme, level, JSON.stringify(imageData)]
  );

  const frame = frameResult.rows[0];

  // 픽셀 셀 생성
  const cells: PixelCell[] = [];
  let order = 0;

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const color = imageData[y][x];
      
      const cellResult = await pool.query(
        `INSERT INTO pixel_cells (frame_id, x, y, color, fill_order) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, frame_id as "frameId", x, y, color, filled, 
                   fill_order as "fillOrder", filled_at as "filledAt"`,
        [frame.id, x, y, color, order]
      );
      
      cells.push(cellResult.rows[0]);
      order++;
    }
  }

  frame.cells = cells;
  return frame;
}