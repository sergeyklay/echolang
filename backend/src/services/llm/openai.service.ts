import OpenAI from 'openai';
import { LLMService, LLMConfig } from './llm.service';
import { logger } from '../../utils/logger';

export class OpenAIService implements LLMService {
  private client: OpenAI;
  private defaultModel: string;

  constructor(config: LLMConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
    this.defaultModel = config.model || 'gpt-4';
  }

  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    systemPrompt: string,
    model?: string
  ): Promise<string> {
    const modelToUse = model || this.defaultModel;

    try {
      const completion = await this.client.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Translate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`,
          },
        ],
        temperature: 0.3,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('OpenAI API error:', error);
      if (error instanceof Error) {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      throw new Error('Failed to translate');
    }
  }
}

