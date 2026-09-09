import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { checkDbConnection, pool } from './config/db.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/api/health', async (req, res) => {
  const dbOk = await checkDbConnection();
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'healthy' : 'unhealthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Early Years Platform REST API',
    database: dbOk ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api', apiRouter);

// Centralized error handler
app.use(errorHandler);

// Server startup
let server: any;

const startServer = async () => {
  const dbReady = await checkDbConnection();
  if (!dbReady) {
    console.error('❌ Failed to connect to database on startup. Exiting.');
    process.exit(1);
  }

  server = app.listen(env.PORT, () => {
    console.log(`
  👶 ======================================================== 👶
     Early Years School Management Platform - REST API (Phase 1)
     Status: Online & Ready
     Port: ${env.PORT}
     Environment: ${env.NODE_ENV}
     API Root: http://localhost:${env.PORT}/api
     Health:   http://localhost:${env.PORT}/api/health
  ==============================================================
    `);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Graceful shutdown
const shutdown = async () => {
  console.log('\nShutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
    });
  }
  await pool.end();
  console.log('PostgreSQL connection pool drained.');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app };
