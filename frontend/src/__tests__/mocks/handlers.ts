import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:3000';

export const handlers = [
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



