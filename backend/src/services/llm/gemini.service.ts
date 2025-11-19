import { GoogleGenAI } from '@google/genai';
import { LLMService, LLMConfig } from './llm.service';
import { logger } from '../../utils/logger';

export class GeminiService implements LLMService {
  private client: GoogleGenAI;
  private defaultModel: string;

  constructor(config: LLMConfig) {
    this.client = new GoogleGenAI({
      apiKey: config.apiKey,
    });
    this.defaultModel = config.model || 'gemini-pro';
  }

  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    systemPrompt: string,
    model?: string
  ): Promise<string> {
    const modelToUse = model || this.defaultModel;
    const prompt = `${systemPrompt}\n\nTranslate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`;

    try {
      const response = await this.client.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config: {
          temperature: 0.3,
        },
      });

      return response.text ?? '';
    } catch (error) {
      logger.error('Gemini API error:', error);
      if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
      }
      throw new Error('Failed to translate');
    }
  }
}

