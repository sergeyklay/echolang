import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export async function getTranslationHistory(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const toneId = req.query.toneId as string | undefined;
    const llmProvider = req.query.llmProvider as string | undefined;

    const where: {
      toneId?: string;
      llmProvider?: string;
    } = {};

    if (toneId) {
      where.toneId = toneId;
    }
    if (llmProvider) {
      where.llmProvider = llmProvider;
    }

    const [translations, total] = await Promise.all([
      prisma.translation.findMany({
        where,
        include: {
          tone: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.translation.count({ where }),
    ]);

    const data = translations.map((t) => ({
      id: t.id,
      sourceText: t.sourceText,
      translatedText: t.translatedText,
      sourceLanguage: t.sourceLanguage,
      targetLanguage: t.targetLanguage,
      toneId: t.toneId,
      toneName: t.tone?.name,
      llmProvider: t.llmProvider,
      model: t.model,
      createdAt: t.createdAt,
    }));

    res.json({
      data,
      total,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('Failed to fetch translation history:', error);
    res.status(500).json({ error: 'Failed to fetch translation history' });
  }
}

export async function getTranslationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const translation = await prisma.translation.findUnique({
      where: { id },
      include: {
        tone: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!translation) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    res.json({
      id: translation.id,
      sourceText: translation.sourceText,
      translatedText: translation.translatedText,
      sourceLanguage: translation.sourceLanguage,
      targetLanguage: translation.targetLanguage,
      toneId: translation.toneId,
      toneName: translation.tone?.name,
      llmProvider: translation.llmProvider,
      model: translation.model,
      createdAt: translation.createdAt,
    });
  } catch (error) {
    logger.error('Failed to fetch translation:', error);
    res.status(500).json({ error: 'Failed to fetch translation' });
  }
}

export async function deleteTranslation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.translation.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Translation deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete translation:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      res.status(404).json({ error: 'Translation not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete translation' });
    }
  }
}

