import { Router } from 'express';
import {
  getTranslationHistory,
  getTranslationById,
  deleteTranslation,
} from '../controllers/history.controller';

const router = Router();

router.get('/', getTranslationHistory);
router.get('/:id', getTranslationById);
router.delete('/:id', deleteTranslation);

export default router;

