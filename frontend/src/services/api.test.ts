import { describe, it, expect } from 'vitest';
import { api } from './api';
import { server } from '../__tests__/mocks/server';
import { http, HttpResponse } from 'msw';

describe('API Service', () => {
  describe('translations.translate', () => {
    it('should translate text successfully', async () => {
      const result = await api.translations.translate({
        sourceText: 'Hello, world!',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        llmProvider: 'openai',
        model: 'gpt-4',
      });

      expect(result).toMatchObject({
        id: 'translation-id',
        sourceText: 'Hello, world!',
        translatedText: '¡Hola, mundo!',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        llmProvider: 'openai',
        model: 'gpt-4',
      });
    });

    it('should handle API errors', async () => {
      server.use(
        http.post('http://localhost:3000/api/translate', () => {
          return HttpResponse.json(
            { error: 'Translation failed' },
            { status: 500 }
          );
        })
      );

      await expect(
        api.translations.translate({
          sourceText: 'Hello',
          sourceLanguage: 'en',
          targetLanguage: 'es',
          llmProvider: 'openai',
        })
      ).rejects.toThrow('Translation failed');
    });
  });

  describe('translations.getHistory', () => {
    it('should fetch translation history', async () => {
      const result = await api.translations.getHistory();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toHaveLength(1);
    });

    it('should build query parameters correctly', async () => {
      const result = await api.translations.getHistory({
        limit: 10,
        offset: 5,
        toneId: 'tone-123',
        llmProvider: 'openai',
      });

      expect(result).toHaveProperty('data');
    });
  });
});



