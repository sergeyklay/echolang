export interface TranslationRequest {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  toneId?: string;
  llmProvider: string;
  model?: string;
}

export interface TranslationResponse {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  toneId?: string;
  toneName?: string;
  llmProvider: string;
  model?: string;
  createdAt: Date;
}

export interface ToneRequest {
  name: string;
  description?: string;
  systemPrompt: string;
}

export interface ApiKeyRequest {
  provider: string;
  apiKey: string;
  isActive?: boolean;
}

