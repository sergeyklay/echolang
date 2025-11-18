import { LLMService, LLMConfig } from './llm.service';
import { logger } from '../../utils/logger';

export class LocalService implements LLMService {
  private apiKey: string;
  private defaultModel: string;
  private baseUrl: string;

  constructor(config: LLMConfig & { baseUrl?: string }) {
    this.apiKey = config.apiKey;
    this.defaultModel = config.model || 'local-model';
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
  }

  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    systemPrompt: string,
    model?: string
  ): Promise<string> {
    const modelToUse = model || this.defaultModel;
    const url = `${this.baseUrl}/api/generate`;

    const prompt = `${systemPrompt}\n\nTranslate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelToUse,
          prompt: prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.text().catch(() => 'Unknown error');
        logger.error('Local LLM API error:', error);
        throw new Error(`Local LLM API error: ${error}`);
      }

      const data = (await response.json()) as { response?: string };
      return data.response || '';
    } catch (error) {
      logger.error('Local LLM service error:', error);
      throw new Error(`Failed to connect to local LLM: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

