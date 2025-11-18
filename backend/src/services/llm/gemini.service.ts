import { LLMService, LLMConfig } from './llm.service';
import { logger } from '../../utils/logger';

export class GeminiService implements LLMService {
  private apiKey: string;
  private defaultModel: string;

  constructor(config: LLMConfig) {
    this.apiKey = config.apiKey;
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${this.apiKey}`;

    const prompt = `${systemPrompt}\n\nTranslate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ error: 'Unknown error' }))) as { error?: { message?: string } };
      logger.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${error.error?.message || 'Failed to translate'}`);
    }

    const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}

