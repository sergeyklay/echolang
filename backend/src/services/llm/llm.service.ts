export interface LLMService {
  translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    systemPrompt: string,
    model?: string
  ): Promise<string>;
}

export interface LLMConfig {
  apiKey: string;
  model?: string;
}

