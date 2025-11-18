import { Router } from 'express';
import { z } from 'zod';
import { translate } from '../controllers/translation.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

const translationSchema = z.object({
  sourceText: z.string().min(1),
  sourceLanguage: z.string().min(2).max(10),
  targetLanguage: z.string().min(2).max(10),
  toneId: z.string().optional(),
  llmProvider: z.string().min(1),
  model: z.string().optional(),
});

router.post('/', validate(translationSchema), translate);

export default router;

