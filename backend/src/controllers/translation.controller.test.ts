import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { translate } from './translation.controller';
import * as translationService from '../services/translation.service';

vi.mock('../services/translation.service');
vi.mock('../utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('TranslationController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: ReturnType<typeof vi.fn>;
  let mockStatus: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    mockRequest = {
      body: {},
    };
    vi.clearAllMocks();
  });

  describe('translate', () => {
    it('should return translation on successful request', async () => {
      const mockTranslation = {
        id: 'translation-id',
        sourceText: 'Hello',
        translatedText: 'Hola',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        toneId: undefined,
        llmProvider: 'openai',
        model: 'gpt-4',
        createdAt: new Date(),
      };

      mockRequest.body = {
        sourceText: 'Hello',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        llmProvider: 'openai',
        model: 'gpt-4',
      };

      vi.mocked(translationService.translateText).mockResolvedValue(mockTranslation);

      await translate(mockRequest as Request, mockResponse as Response);

      expect(translationService.translateText).toHaveBeenCalledWith({
        sourceText: 'Hello',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        llmProvider: 'openai',
        model: 'gpt-4',
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockTranslation);
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed');
      mockRequest.body = {
        sourceText: '',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        llmProvider: 'openai',
      };

      vi.mocked(translationService.translateText).mockRejectedValue(error);

      await translate(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Validation failed',
      });
    });

    it('should handle not found errors with 404 status', async () => {
      const error = new Error('Tone not found: invalid-id');
      mockRequest.body = {
        sourceText: 'Hello',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        llmProvider: 'openai',
        toneId: 'invalid-id',
      };

      vi.mocked(translationService.translateText).mockRejectedValue(error);

      await translate(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Tone not found: invalid-id',
      });
    });
  });
});



