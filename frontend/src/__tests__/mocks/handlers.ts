import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Array of mock HTTP handlers for API endpoints used in tests.
 *
 * Provides deterministic network responses for:
 * - POST /api/translate: Returns a translation object with id, sourceText, translatedText,
 *   sourceLanguage, targetLanguage, toneId, llmProvider, model, and createdAt fields
 * - GET /api/translations: Returns a paginated response with data array containing translation
 *   objects, plus total, limit, and offset fields for pagination
 * - GET /api/tones: Returns an object with data array containing tone objects with id, name,
 *   description, systemPrompt, createdAt, and updatedAt fields
 *
 * Tests import this export to register MSW handlers for deterministic network responses,
 * allowing tests to run without requiring a live backend server.
 *
 * @type {HttpHandler[]}
 *
 * @example
 * // In test setup file (src/__tests__/setup.ts):
 * import { server } from './mocks/server';
 * beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 */
export const handlers: HttpHandler[] = [
  http.post(`${API_BASE_URL}/api/translate`, () => {
    return HttpResponse.json({
      id: 'translation-id',
      sourceText: 'Hello, world!',
      translatedText: '¡Hola, mundo!',
      sourceLanguage: 'en',
      targetLanguage: 'es',
      toneId: undefined,
      llmProvider: 'openai',
      model: 'gpt-4',
      createdAt: '2024-01-01T00:00:00Z',
    });
  }),

  http.get(`${API_BASE_URL}/api/translations`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 'translation-id',
          sourceText: 'Hello',
          translatedText: 'Hola',
          sourceLanguage: 'en',
          targetLanguage: 'es',
          toneId: undefined,
          llmProvider: 'openai',
          model: 'gpt-4',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ],
      total: 1,
      limit: 50,
      offset: 0,
    });
  }),

  http.get(`${API_BASE_URL}/api/tones`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 'tone-id',
          name: 'Official',
          description: 'Formal tone',
          systemPrompt: 'Translate formally',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
    });
  }),
];



