import { useState, useEffect } from 'react';
import { api } from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Tone, TranslationRequest } from '../types';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

const LLM_PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'local', label: 'Local' },
];

/**
 * Main translator page component.
 *
 * Provides the primary translation interface where users can:
 * - Input text to translate
 * - Select source and target languages
 * - Choose translation tone
 * - Select LLM provider and model
 * - View translated output
 *
 * Translation settings are persisted to localStorage for convenience.
 */
export function Translator() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useLocalStorage('translator.sourceLanguage', 'en');
  const [targetLanguage, setTargetLanguage] = useLocalStorage('translator.targetLanguage', 'es');
  const [toneId, setToneId] = useLocalStorage<string>('translator.toneId', '');
  const [llmProvider, setLlmProvider] = useLocalStorage('translator.llmProvider', 'openai');
  const [model, setModel] = useLocalStorage('translator.model', '');
  const [tones, setTones] = useState<Tone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useDocumentTitle('Translator');

  useEffect(() => {
    loadTones();
  }, []);

  useEffect(() => {
    if (tones.length > 0 && toneId) {
      const toneExists = tones.some((tone) => tone.id === toneId);
      if (!toneExists) {
        setToneId('');
      }
    }
  }, [tones, toneId, setToneId]);

  const loadTones = async () => {
    try {
      const response = await api.tones.getAll();
      setTones(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tones');
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const request: TranslationRequest = {
        sourceText,
        sourceLanguage,
        targetLanguage,
        llmProvider,
        ...(toneId && { toneId }),
        ...(model && { model }),
      };

      const result = await api.translations.translate(request);
      setTranslatedText(result.translatedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const isTranslateDisabled = !toneId || loading || !sourceText.trim();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Translator</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Language
            </label>
            <select
              value={sourceLanguage}
              onChange={(e) => {
                setSourceLanguage(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => {
                setTargetLanguage(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={toneId}
              onChange={(e) => {
                setToneId(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a tone</option>
              {tones.map((tone) => (
                <option key={tone.id} value={tone.id}>
                  {tone.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LLM Provider
            </label>
            <select
              value={llmProvider}
              onChange={(e) => {
                setLlmProvider(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LLM_PROVIDERS.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model (Optional)
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
              }}
              placeholder="e.g., gpt-4, claude-3-opus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input
            </label>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output
            </label>
            <textarea
              value={translatedText}
              readOnly
              placeholder="Translated text will appear here..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md bg-gray-50 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          onClick={handleTranslate}
          disabled={isTranslateDisabled}
          className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
            isTranslateDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
}

