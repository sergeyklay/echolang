export interface Tone {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  toneId?: string;
  toneName?: string;
  llmProvider: string;
  model?: string;
  createdAt: string;
}

export interface TranslationRequest {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  toneId?: string;
  llmProvider: string;
  model?: string;
}

export interface ApiKey {
  id: string;
  provider: string;
  isActive: boolean;
  hasKey: boolean;
  baseUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKeyRequest {
  provider: string;
  apiKey: string;
  isActive?: boolean;
  baseUrl?: string;
}

export interface HistoryResponse {
  data: Translation[];
  total: number;
  limit: number;
  offset: number;
}

export interface TonesResponse {
  data: Tone[];
}

