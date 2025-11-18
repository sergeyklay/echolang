import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { encryptionService } from '../services/encryption.service';
import { logger } from '../utils/logger';

export async function getApiKeys(req: Request, res: Response) {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const response = apiKeys.map((key) => ({
      id: key.id,
      provider: key.provider,
      isActive: key.isActive,
      hasKey: !!key.encryptedKey,
      baseUrl: key.baseUrl,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    }));

    res.json({ data: response });
  } catch (error) {
    logger.error('Failed to fetch API keys:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
}

export async function createApiKey(req: Request, res: Response) {
  try {
    const { provider, apiKey, isActive = true, baseUrl } = req.body;
    const normalizedBaseUrl = baseUrl && baseUrl.trim() !== '' ? baseUrl : null;

    if (!provider || !apiKey) {
      return res.status(400).json({ error: 'Provider and API key are required' });
    }

    const encryptedKey = encryptionService.encrypt(apiKey);

    const existingKey = await prisma.apiKey.findUnique({
      where: { provider: provider.toLowerCase() },
    });

    let apiKeyRecord;
    if (existingKey) {
      apiKeyRecord = await prisma.apiKey.update({
        where: { provider: provider.toLowerCase() },
        data: {
          encryptedKey,
          isActive,
          baseUrl: normalizedBaseUrl,
        },
      });
    } else {
      apiKeyRecord = await prisma.apiKey.create({
        data: {
          provider: provider.toLowerCase(),
          encryptedKey,
          isActive,
          baseUrl: normalizedBaseUrl,
        },
      });
    }

    res.json({
      id: apiKeyRecord.id,
      provider: apiKeyRecord.provider,
      isActive: apiKeyRecord.isActive,
      hasKey: true,
      baseUrl: apiKeyRecord.baseUrl,
      createdAt: apiKeyRecord.createdAt,
      updatedAt: apiKeyRecord.updatedAt,
    });
  } catch (error) {
    logger.error('Failed to create/update API key:', error);
    if (error instanceof Error && error.message.includes('ENCRYPTION_KEY')) {
      res.status(500).json({ error: 'Encryption key not configured. Please set ENCRYPTION_KEY environment variable.' });
    } else {
      res.status(500).json({ error: 'Failed to save API key' });
    }
  }
}

export async function updateApiKey(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { apiKey, isActive, baseUrl } = req.body;
    const normalizedBaseUrl = baseUrl !== undefined ? (baseUrl && baseUrl.trim() !== '' ? baseUrl : null) : undefined;

    const existingKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!existingKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    const updateData: { encryptedKey?: string; isActive?: boolean; baseUrl?: string | null } = {};
    if (apiKey !== undefined) {
      updateData.encryptedKey = encryptionService.encrypt(apiKey);
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
    if (normalizedBaseUrl !== undefined) {
      updateData.baseUrl = normalizedBaseUrl;
    }

    const apiKeyRecord = await prisma.apiKey.update({
      where: { id },
      data: updateData,
    });

    res.json({
      id: apiKeyRecord.id,
      provider: apiKeyRecord.provider,
      isActive: apiKeyRecord.isActive,
      hasKey: !!apiKeyRecord.encryptedKey,
      baseUrl: apiKeyRecord.baseUrl,
      createdAt: apiKeyRecord.createdAt,
      updatedAt: apiKeyRecord.updatedAt,
    });
  } catch (error) {
    logger.error('Failed to update API key:', error);
    if (error instanceof Error && error.message.includes('ENCRYPTION_KEY')) {
      res.status(500).json({ error: 'Encryption key not configured. Please set ENCRYPTION_KEY environment variable.' });
    } else if (error instanceof Error && error.message.includes('Record to update not found')) {
      res.status(404).json({ error: 'API key not found' });
    } else {
      res.status(500).json({ error: 'Failed to update API key' });
    }
  }
}

export async function deleteApiKey(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.apiKey.delete({
      where: { id },
    });
    res.json({ success: true, message: 'API key deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete API key:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      res.status(404).json({ error: 'API key not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete API key' });
    }
  }
}

