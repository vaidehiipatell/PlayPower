import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';

dotenv.config();

const require = createRequire(import.meta.url);
const openapi = require('./docs/openapi.json');

// Build app using a helper for reuse in Netlify Functions
export function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
  app.use('/auth', authRoutes);
  app.use('/quizzes', quizRoutes);

  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
  });
  return app;
}

const PORT = process.env.PORT || 8080;

async function start() {
  await connectDB();
  const app = buildApp();
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}

if (process.env.NETLIFY !== 'true') {
  start().catch((e) => {
    console.error('Failed to start server', e);
    process.exit(1);
  });
}
