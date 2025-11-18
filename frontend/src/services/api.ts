import type {
  Translation,
  TranslationRequest,
  Tone,
  ApiKey,
  ApiKeyRequest,
  HistoryResponse,
  TonesResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.details && Array.isArray(errorData.details)) {
        errorMessage = errorData.details.map((d: any) => d.message || d.path?.join('.')).join(', ');
      }
    } catch {
      errorMessage = `HTTP error! status: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  translations: {
    translate: (data: TranslationRequest): Promise<Translation> =>
      fetchAPI<Translation>('/api/translate', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getHistory: (params?: {
      limit?: number;
      offset?: number;
      toneId?: string;
      llmProvider?: string;
    }): Promise<HistoryResponse> => {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.toneId) queryParams.append('toneId', params.toneId);
      if (params?.llmProvider) queryParams.append('llmProvider', params.llmProvider);

      const query = queryParams.toString();
      return fetchAPI<HistoryResponse>(`/api/translations${query ? `?${query}` : ''}`);
    },

    getById: (id: string): Promise<Translation> =>
      fetchAPI<Translation>(`/api/translations/${id}`),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      fetchAPI(`/api/translations/${id}`, {
        method: 'DELETE',
      }),
  },

  tones: {
    getAll: (): Promise<TonesResponse> =>
      fetchAPI<TonesResponse>('/api/tones'),

    getById: (id: string): Promise<Tone> =>
      fetchAPI<Tone>(`/api/tones/${id}`),

    create: (data: { name: string; description?: string; systemPrompt: string }): Promise<Tone> =>
      fetchAPI<Tone>('/api/tones', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (
      id: string,
      data: { name: string; description?: string; systemPrompt: string }
    ): Promise<Tone> =>
      fetchAPI<Tone>(`/api/tones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      fetchAPI(`/api/tones/${id}`, {
        method: 'DELETE',
      }),
  },

  settings: {
    getApiKeys: (): Promise<{ data: ApiKey[] }> =>
      fetchAPI<{ data: ApiKey[] }>('/api/settings/api-keys'),

    createApiKey: (data: ApiKeyRequest): Promise<ApiKey> =>
      fetchAPI<ApiKey>('/api/settings/api-keys', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateApiKey: (id: string, data: { apiKey?: string; isActive?: boolean }): Promise<ApiKey> =>
      fetchAPI<ApiKey>(`/api/settings/api-keys/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteApiKey: (id: string): Promise<{ success: boolean; message: string }> =>
      fetchAPI(`/api/settings/api-keys/${id}`, {
        method: 'DELETE',
      }),
  },
};

