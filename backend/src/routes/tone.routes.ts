import { Router } from 'express';
import { z } from 'zod';
import {
  getAllTones,
  getToneById,
  createTone,
  updateTone,
  deleteTone,
} from '../controllers/tone.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

const toneSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  systemPrompt: z.string().min(1),
});

router.get('/', getAllTones);
router.get('/:id', getToneById);
router.post('/', validate(toneSchema), createTone);
router.put('/:id', validate(toneSchema), updateTone);
router.delete('/:id', deleteTone);

export default router;

