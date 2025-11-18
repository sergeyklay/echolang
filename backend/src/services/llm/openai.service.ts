import { LLMService, LLMConfig } from './llm.service';
import { logger } from '../../utils/logger';

export class OpenAIService implements LLMService {
  private apiKey: string;
  private defaultModel: string;

  constructor(config: LLMConfig) {
    this.apiKey = config.apiKey;
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
    const url = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
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
      }),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ error: 'Unknown error' }))) as { error?: { message?: string } };
      logger.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Failed to translate'}`);
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || '';
  }
}

