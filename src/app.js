import express from 'express';
import cors from 'cors';
import csrf from 'csurf';
import helmet from 'helmet';
import ApiResponse from './utils/ApiResponse.js';
import logger from './middlewares/logger.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import authMiddleware from './middlewares/authMiddleware.js';
import expenseRouter from './routes/expenseRouter.js';
import profileRouter from './routes/profileRoutes.js';
import securityMiddleware from './middlewares/securityMiddleware.js';
import { authLimiter, apiLimiter } from './middlewares/rateLimiter.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables!');
}

const app = express();

// CORS configuration - more restrictive for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? ['https://yourfrontend.com'] // replace with your frontend domain
      : true, // allows all origins in development
  credentials: true, // allows cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(JWT_SECRET));
app.use(logger);
app.use(securityMiddleware);

// CSRF protection setup
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // only use secure in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  },
});

// Route to get the CSRF token
app.get('/csrf-token', csrfProtection, (req, res) => {
  ApiResponse.send(res, 200, 'CSRF token', { csrfToken: req.csrfToken() });
});

// Public Routes
app.get('/', (req, res) => {
  ApiResponse.send(res, 200, 'Expense Tracker API', {});
});

// Apply auth rate limiter specifically to login and register routes
// Note: We're applying these before the authRouter is mounted
app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);

// Then mount the auth router with CSRF protection
app.use('/auth', csrfProtection, authRouter);

// Apply API rate limiter to all API routes
app.use('/api', apiLimiter);

// Protected Routes - with CSRF and auth middleware
app.use('/api/expenses', csrfProtection, authMiddleware, expenseRouter);
app.use('/api/profile', csrfProtection, authMiddleware, profileRouter);

// CSRF Error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return ApiResponse.error(res, 403, 'CSRF token validation failed');
  }
  next(err);
});

// Invalid Routes
app.use('*', (req, res) => {
  ApiResponse.error(res, 404, 'Invalid Request');
});

export default app;
