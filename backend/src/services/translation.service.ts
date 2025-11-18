import { prisma } from '../config/database';
import { encryptionService } from './encryption.service';
import { LLMService } from './llm/llm.service';
import { OpenAIService } from './llm/openai.service';
import { AnthropicService } from './llm/anthropic.service';
import { GeminiService } from './llm/gemini.service';
import { LocalService } from './llm/local.service';
import { TranslationRequest } from '../types';
import { logger } from '../utils/logger';

function createLLMService(provider: string, apiKey: string, model?: string, baseUrl?: string): LLMService {
  const config = { apiKey, model };

  switch (provider.toLowerCase()) {
    case 'openai':
      return new OpenAIService(config);
    case 'anthropic':
      return new AnthropicService(config);
    case 'gemini':
      return new GeminiService(config);
    case 'local':
      return new LocalService({ ...config, baseUrl: baseUrl || 'http://localhost:11434' });
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

async function getApiKey(provider: string): Promise<string> {
  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { provider: provider.toLowerCase() },
  });

  if (!apiKeyRecord || !apiKeyRecord.isActive) {
    throw new Error(`No active API key found for provider: ${provider}`);
  }

  return encryptionService.decrypt(apiKeyRecord.encryptedKey);
}

async function getBaseUrl(provider: string): Promise<string | undefined> {
  if (provider.toLowerCase() !== 'local') {
    return undefined;
  }

  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { provider: 'local' },
  });

  return apiKeyRecord?.baseUrl || undefined;
}

async function getSystemPrompt(toneId?: string): Promise<string> {
  if (!toneId) {
    return 'You are a professional translator. Translate the text accurately while preserving the original meaning and tone.';
  }

  const tone = await prisma.tone.findUnique({
    where: { id: toneId },
  });

  if (!tone) {
    throw new Error(`Tone not found: ${toneId}`);
  }

  return tone.systemPrompt;
}

export async function translateText(request: TranslationRequest): Promise<{
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  toneId?: string;
  llmProvider: string;
  model?: string;
  createdAt: Date;
}> {
  try {
    const systemPrompt = await getSystemPrompt(request.toneId);
    const apiKey = await getApiKey(request.llmProvider);
    const baseUrl = await getBaseUrl(request.llmProvider);
    const llmService = createLLMService(request.llmProvider, apiKey, request.model, baseUrl);

    logger.info(`Translating text using ${request.llmProvider}...`);
    const translatedText = await llmService.translate(
      request.sourceText,
      request.sourceLanguage,
      request.targetLanguage,
      systemPrompt,
      request.model
    );

    const translation = await prisma.translation.create({
      data: {
        sourceText: request.sourceText,
        translatedText: translatedText,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        toneId: request.toneId || null,
        llmProvider: request.llmProvider,
        model: request.model || null,
      },
    });

    return {
      id: translation.id,
      sourceText: translation.sourceText,
      translatedText: translation.translatedText,
      sourceLanguage: translation.sourceLanguage,
      targetLanguage: translation.targetLanguage,
      toneId: translation.toneId || undefined,
      llmProvider: translation.llmProvider,
      model: translation.model || undefined,
      createdAt: translation.createdAt,
    };
  } catch (error) {
    logger.error('Translation failed:', error);
    throw error;
  }
}

