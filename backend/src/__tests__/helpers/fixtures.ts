export const testFixtures = {
  tone: {
    name: 'Official',
    description: 'Formal and professional tone',
    systemPrompt: 'Translate in a formal and professional manner.',
  },
  translation: {
    sourceText: 'Hello, world!',
    sourceLanguage: 'en',
    targetLanguage: 'es',
    llmProvider: 'openai',
    model: 'gpt-4',
  },
  apiKey: {
    provider: 'openai',
    encryptedKey: 'test-encrypted-key',
    isActive: true,
  },
};



