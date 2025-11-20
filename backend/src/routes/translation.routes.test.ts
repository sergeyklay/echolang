import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import * as translationService from '../services/translation.service';

vi.mock('../services/translation.service');
vi.mock('../services/encryption.service', () => ({
  encryptionService: {
    encrypt: vi.fn((text: string) => `encrypted-${text}`),
    decrypt: vi.fn((text: string) => text.replace('encrypted-', '')),
  },
}));
vi.mock('../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('Translation Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/translate', () => {
    it('should translate text successfully', async () => {
      const mockTranslation = {
        id: 'translation-id',
        sourceText: 'Hello, world!',
        translatedText: '¡Hola, mundo!',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        toneId: undefined,
        llmProvider: 'openai',
        model: 'gpt-4',
        createdAt: new Date(),
      };

      vi.mocked(translationService.translateText).mockResolvedValue(mockTranslation);

      const response = await request(app)
        .post('/api/translate')
        .send({
          sourceText: 'Hello, world!',
          sourceLanguage: 'en',
          targetLanguage: 'es',
          llmProvider: 'openai',
          model: 'gpt-4',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        id: 'translation-id',
        sourceText: 'Hello, world!',
        translatedText: '¡Hola, mundo!',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        llmProvider: 'openai',
        model: 'gpt-4',
      });
    });

    it('should return 400 for validation errors', async () => {
      const response = await request(app)
        .post('/api/translate')
        .send({
          sourceText: '',
          sourceLanguage: 'en',
          targetLanguage: 'es',
          llmProvider: 'openai',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 500 for service errors', async () => {
      vi.mocked(translationService.translateText).mockRejectedValue(
        new Error('LLM service unavailable')
      );

      const response = await request(app)
        .post('/api/translate')
        .send({
          sourceText: 'Hello',
          sourceLanguage: 'en',
          targetLanguage: 'es',
          llmProvider: 'openai',
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});



