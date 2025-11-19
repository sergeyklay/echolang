import Anthropic from '@anthropic-ai/sdk';
import { LLMService, LLMConfig } from './llm.service';
import { logger } from '../../utils/logger';

export class AnthropicService implements LLMService {
  private client: Anthropic;
  private defaultModel: string;

  constructor(config: LLMConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
    this.defaultModel = config.model || 'claude-3-opus-20240229';
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
      const message = await this.client.messages.create({
        model: modelToUse,
        max_tokens: 1024,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Translate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`,
          },
        ],
      });

      const textContent = message.content.find((block) => block.type === 'text');
      if (textContent && 'text' in textContent) {
        return textContent.text;
      }
      return '';
    } catch (error) {
      logger.error('Anthropic API error:', error);
      if (error instanceof Error) {
        throw new Error(`Anthropic API error: ${error.message}`);
      }
      throw new Error('Failed to translate');
    }
  }
}

