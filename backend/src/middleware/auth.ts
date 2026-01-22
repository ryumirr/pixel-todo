import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: '액세스 토큰이 필요합니다'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-key', (err, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: '유효하지 않은 토큰입니다'
      });
    }

    req.userId = decoded.userId;
    next();
  });
};