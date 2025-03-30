// middlewares/rateLimiter.js
import rateLimit from 'express-rate-limit';
import ApiResponse from '../utils/ApiResponse.js';

// Auth routes limiter (login, register)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // 5 requests per hour
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many login attempts, please try again after an hour',
  },
});

// API routes general limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many requests, please try again later',
  },
});
