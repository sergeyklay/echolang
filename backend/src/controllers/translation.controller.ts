import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { translateText } from '../services/translation.service';
import { logger } from '../utils/logger';
import { ValidationError } from '../utils/errors';

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

    let statusCode = 500;
    let errorMessage = 'Translation failed';

    if (error instanceof ValidationError || (error instanceof Error && error.name === 'ValidationError')) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error instanceof ZodError) {
      statusCode = 400;
      errorMessage = 'Validation failed';
    } else if (error instanceof Error && error.message.includes('not found')) {
      statusCode = 404;
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(statusCode).json({
      error: errorMessage,
    });
  }
}

