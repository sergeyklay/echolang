import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Translation } from '../types';

/**
 * History page component that displays the user's translation history.
 *
 * Fetches and displays a list of past translations with the ability to
 * copy translated text to clipboard or delete individual entries.
 * Supports pagination with a limit of 50 most recent translations.
 */
export function History() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useDocumentTitle('History');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await api.translations.getHistory({ limit: 50 });
      setTranslations(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setError('Failed to copy text');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this translation?')) {
      return;
    }

    try {
      await api.translations.delete(id);
      setTranslations(translations.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete translation');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">History</h1>
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">History</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {translations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          No translation history found.
        </div>
      ) : (
        <div className="space-y-4">
          {translations.map((translation) => (
            <div
              key={translation.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {translation.sourceLanguage.toUpperCase()} →{' '}
                      {translation.targetLanguage.toUpperCase()}
                    </span>
                    {translation.toneName && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {translation.toneName}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {translation.llmProvider}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(translation.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(translation.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Source</p>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {translation.sourceText}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Translation</p>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {translation.translatedText}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(translation.translatedText, translation.id)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                {copiedId === translation.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

