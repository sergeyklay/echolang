import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export async function getAllTones(req: Request, res: Response) {
  try {
    const tones = await prisma.tone.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: tones });
  } catch (error) {
    logger.error('Failed to fetch tones:', error);
    res.status(500).json({ error: 'Failed to fetch tones' });
  }
}

export async function getToneById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tone = await prisma.tone.findUnique({
      where: { id },
    });

    if (!tone) {
      return res.status(404).json({ error: 'Tone not found' });
    }

    res.json(tone);
  } catch (error) {
    logger.error('Failed to fetch tone:', error);
    res.status(500).json({ error: 'Failed to fetch tone' });
  }
}

export async function createTone(req: Request, res: Response) {
  try {
    const { name, description, systemPrompt } = req.body;
    const tone = await prisma.tone.create({
      data: {
        name,
        description,
        systemPrompt,
      },
    });
    res.status(201).json(tone);
  } catch (error) {
    logger.error('Failed to create tone:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      res.status(409).json({ error: 'Tone with this name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create tone' });
    }
  }
}

export async function updateTone(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, systemPrompt } = req.body;

    const tone = await prisma.tone.update({
      where: { id },
      data: {
        name,
        description,
        systemPrompt,
      },
    });

    res.json(tone);
  } catch (error) {
    logger.error('Failed to update tone:', error);
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      res.status(404).json({ error: 'Tone not found' });
    } else if (error instanceof Error && error.message.includes('Unique constraint')) {
      res.status(409).json({ error: 'Tone with this name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update tone' });
    }
  }
}

export async function deleteTone(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.tone.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Tone deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete tone:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      res.status(404).json({ error: 'Tone not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete tone' });
    }
  }
}

