import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../types';

export const register = async (
  req: Request<{}, ApiResponse<AuthResponse>, RegisterRequest>,
  res: Response<ApiResponse<AuthResponse>>
) => {
  try {
    const { username, email, password } = req.body;

    // 이메일 중복 체크
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: '이미 존재하는 이메일입니다'
      });
    }

    // 비밀번호 해시
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at',
      [username, email, passwordHash]
    );

    const user = result.rows[0];

    // 사용자 통계 초기화
    await pool.query(
      'INSERT INTO user_stats (user_id) VALUES ($1)',
      [user.id]
    );

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-jwt-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};

export const login = async (
  req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>,
  res: Response<ApiResponse<AuthResponse>>
) => {
  try {
    const { email, password } = req.body;

    // 사용자 조회
    const result = await pool.query(
      'SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: '이메일 또는 비밀번호가 올바르지 않습니다'
      });
    }

    const user = result.rows[0];

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: '이메일 또는 비밀번호가 올바르지 않습니다'
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-jwt-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
};