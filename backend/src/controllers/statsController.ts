import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { UserStats, ApiResponse } from '../types';

export const getStats = async (
  req: AuthRequest,
  res: Response<ApiResponse<UserStats>>
) => {
  try {
    // 사용자 통계 조회
    let statsResult = await pool.query(
      `SELECT id, user_id as "userId", today_completed as "todayCompleted", 
              total_completed as "totalCompleted", current_streak as "currentStreak", 
              longest_streak as "longestStreak", last_completed_date as "lastCompletedDate", 
              completed_frames as "completedFrames", updated_at as "updatedAt"
       FROM user_stats 
       WHERE user_id = $1`,
      [req.userId]
    );

    // 통계가 없으면 생성
    if (statsResult.rows.length === 0) {
      await pool.query(
        'INSERT INTO user_stats (user_id) VALUES ($1)',
        [req.userId]
      );

      statsResult = await pool.query(
        `SELECT id, user_id as "userId", today_completed as "todayCompleted", 
                total_completed as "totalCompleted", current_streak as "currentStreak", 
                longest_streak as "longestStreak", last_completed_date as "lastCompletedDate", 
                completed_frames as "completedFrames", updated_at as "updatedAt"
         FROM user_stats 
         WHERE user_id = $1`,
        [req.userId]
      );
    }

    const stats = statsResult.rows[0];

    // 완성된 프레임 수 업데이트
    const frameCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM gallery_items WHERE user_id = $1',
      [req.userId]
    );

    const completedFrames = parseInt(frameCountResult.rows[0].count);

    if (completedFrames !== stats.completedFrames) {
      await pool.query(
        'UPDATE user_stats SET completed_frames = $1 WHERE user_id = $2',
        [completedFrames, req.userId]
      );
      stats.completedFrames = completedFrames;
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};

export const updateStats = async (
  req: AuthRequest,
  res: Response<ApiResponse<UserStats>>
) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 현재 통계 조회
    const statsResult = await pool.query(
      'SELECT * FROM user_stats WHERE user_id = $1',
      [req.userId]
    );

    if (statsResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '사용자 통계를 찾을 수 없습니다'
      });
    }

    const currentStats = statsResult.rows[0];
    const lastCompletedDate = currentStats.last_completed_date?.toISOString().split('T')[0];

    let newTodayCompleted = currentStats.today_completed;
    let newCurrentStreak = currentStats.current_streak;

    // 오늘 첫 완료인 경우
    if (lastCompletedDate !== today) {
      newTodayCompleted = 1;
      
      // 어제 완료했으면 streak 증가, 아니면 1로 리셋
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastCompletedDate === yesterdayStr) {
        newCurrentStreak += 1;
      } else {
        newCurrentStreak = 1;
      }
    } else {
      // 오늘 이미 완료한 적이 있으면 카운트만 증가
      newTodayCompleted += 1;
    }

    const newLongestStreak = Math.max(currentStats.longest_streak, newCurrentStreak);

    // 통계 업데이트
    const updatedResult = await pool.query(
      `UPDATE user_stats 
       SET today_completed = $1, 
           total_completed = total_completed + 1,
           current_streak = $2,
           longest_streak = $3,
           last_completed_date = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $5
       RETURNING id, user_id as "userId", today_completed as "todayCompleted", 
                 total_completed as "totalCompleted", current_streak as "currentStreak", 
                 longest_streak as "longestStreak", last_completed_date as "lastCompletedDate", 
                 completed_frames as "completedFrames", updated_at as "updatedAt"`,
      [newTodayCompleted, newCurrentStreak, newLongestStreak, today, req.userId]
    );

    res.json({
      success: true,
      data: updatedResult.rows[0]
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};