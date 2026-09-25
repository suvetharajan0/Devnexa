import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { sendSuccess } from './utils/ApiResponse.js';
import projectRoutes from './routes/project.routes.js';
import authRoutes from './routes/auth.routes.js';
import applicationRoutes from './routes/application.routes.js';
import teamRoutes from './routes/team.routes.js';
import taskRoutes from './routes/task.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import userRoutes from './routes/user.routes.js';
import aiRoutes from './routes/ai.routes.js'
import notificationRoutes from './routes/notification.routes.js'; 
import compression from 'compression';

export function createApp() {
  const app = express();

  app.use(helmet({crossOriginResourcePolicy: {policy: 'cross-origin'},}));
  app.use(compression());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // Basic API-wide rate limiting; AI routes get a stricter limiter of their own later.
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get('/api/v1/health', (req, res) => {
    sendSuccess(res, 200, {
      status: 'ok',
      brand: 'Devnexa',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/v1/projects', projectRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/applications', applicationRoutes);
  app.use('/api/v1/teams', teamRoutes);
  app.use('/api/v1/tasks', taskRoutes);
  app.use('/api/v1/conversations', conversationRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/ai', aiRoutes)
  app.use('/api/v1/notifications', notificationRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
