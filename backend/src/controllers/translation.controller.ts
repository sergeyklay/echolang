import { Request, Response } from 'express';
import { translateText } from '../services/translation.service';
import { logger } from '../utils/logger';

export async function translate(req: Request, res: Response) {
  try {
    const { sourceText, sourceLanguage, targetLanguage, toneId, llmProvider, model } = req.body;

    const translation = await translateText({
      sourceText,
      sourceLanguage,
      targetLanguage,
      toneId,
      llmProvider,
      model,
    });

    res.status(201).json({
      id: translation.id,
      sourceText: translation.sourceText,
      translatedText: translation.translatedText,
      sourceLanguage: translation.sourceLanguage,
      targetLanguage: translation.targetLanguage,
      toneId: translation.toneId,
      llmProvider: translation.llmProvider,
      model: translation.model,
      createdAt: translation.createdAt,
    });
  } catch (error) {
    logger.error('Translation failed:', error);
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      error: error instanceof Error ? error.message : 'Translation failed',
    });
  }
}

