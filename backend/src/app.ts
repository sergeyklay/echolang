import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';
import toneRoutes from './routes/tone.routes';
import historyRoutes from './routes/history.routes';
import translationRoutes from './routes/translation.routes';
import { logger } from './utils/logger';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tones', toneRoutes);
app.use('/api/translations', historyRoutes);
app.use('/api/translate', translationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;

