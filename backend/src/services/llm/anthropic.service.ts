import { LLMService, LLMConfig } from './llm.service';
import { logger } from '../../utils/logger';

export class AnthropicService implements LLMService {
  private apiKey: string;
  private defaultModel: string;

  constructor(config: LLMConfig) {
    this.apiKey = config.apiKey;
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
    const url = 'https://api.anthropic.com/v1/messages';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelToUse,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Translate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ error: 'Unknown error' }))) as { error?: { message?: string } };
      logger.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${error.error?.message || 'Failed to translate'}`);
    }

    const data = (await response.json()) as { content?: Array<{ text?: string }> };
    return data.content?.[0]?.text || '';
  }
}

