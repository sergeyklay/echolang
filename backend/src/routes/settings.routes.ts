import { Router } from 'express';
import { z } from 'zod';
import {
  getApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
} from '../controllers/settings.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

const apiKeySchema = z.object({
  provider: z.string().min(1),
  apiKey: z.string().min(1),
  isActive: z.boolean().optional(),
});

const updateApiKeySchema = z.object({
  apiKey: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
}).refine(data => data.apiKey !== undefined || data.isActive !== undefined, {
  message: 'At least one field (apiKey or isActive) must be provided',
});

router.get('/api-keys', getApiKeys);
router.post('/api-keys', validate(apiKeySchema), createApiKey);
router.put('/api-keys/:id', validate(updateApiKeySchema), updateApiKey);
router.delete('/api-keys/:id', deleteApiKey);

export default router;

