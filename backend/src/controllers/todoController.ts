import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { Todo, CreateTodoRequest, UpdateTodoRequest, ApiResponse } from '../types';

export const getTodos = async (
  req: AuthRequest,
  res: Response<ApiResponse<Todo[]>>
) => {
  try {
    const result = await pool.query(
      'SELECT id, user_id as "userId", text, completed, created_at as "createdAt", completed_at as "completedAt" FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};

export const createTodo = async (
  req: AuthRequest,
  res: Response<ApiResponse<Todo>>
) => {
  try {
    const { text } = req.body;

    const result = await pool.query(
      'INSERT INTO todos (user_id, text) VALUES ($1, $2) RETURNING id, user_id as "userId", text, completed, created_at as "createdAt", completed_at as "completedAt"',
      [req.userId, text]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};

export const updateTodo = async (
  req: AuthRequest,
  res: Response<ApiResponse<Todo>>
) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const completedAt = completed ? new Date() : null;

    const result = await pool.query(
      'UPDATE todos SET completed = $1, completed_at = $2 WHERE id = $3 AND user_id = $4 RETURNING id, user_id as "userId", text, completed, created_at as "createdAt", completed_at as "completedAt"',
      [completed, completedAt, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TODO를 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};

export const deleteTodo = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'TODO를 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      message: 'TODO가 삭제되었습니다'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};