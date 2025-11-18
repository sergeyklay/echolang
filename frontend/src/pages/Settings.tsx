import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Tone, ApiKey } from '../types';

const LLM_PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'local', label: 'Local' },
];

export function Settings() {
  const [tones, setTones] = useState<Tone[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [toneForm, setToneForm] = useState({
    name: '',
    description: '',
    systemPrompt: '',
  });
  const [editingTone, setEditingTone] = useState<Tone | null>(null);
  const [showToneForm, setShowToneForm] = useState(false);

  const [apiKeyForm, setApiKeyForm] = useState({
    provider: 'openai',
    apiKey: '',
    isActive: true,
  });
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tonesResponse, apiKeysResponse] = await Promise.all([
        api.tones.getAll(),
        api.settings.getApiKeys().catch(() => ({ data: [] })),
      ]);
      setTones(tonesResponse.data);
      setApiKeys(apiKeysResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTone) {
        await api.tones.update(editingTone.id, toneForm);
        setSuccess('Tone updated successfully');
      } else {
        await api.tones.create(toneForm);
        setSuccess('Tone created successfully');
      }
      setToneForm({ name: '', description: '', systemPrompt: '' });
      setEditingTone(null);
      setShowToneForm(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tone');
    }
  };

  const handleToneEdit = (tone: Tone) => {
    setEditingTone(tone);
    setToneForm({
      name: tone.name,
      description: tone.description || '',
      systemPrompt: tone.systemPrompt,
    });
    setShowToneForm(true);
  };

  const handleToneDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tone?')) {
      return;
    }

    try {
      await api.tones.delete(id);
      setSuccess('Tone deleted successfully');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tone');
    }
  };

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingApiKey) {
        await api.settings.updateApiKey(editingApiKey.id, {
          apiKey: apiKeyForm.apiKey,
          isActive: apiKeyForm.isActive,
        });
        setSuccess('API key updated successfully');
      } else {
        await api.settings.createApiKey(apiKeyForm);
        setSuccess('API key saved successfully');
      }
      setApiKeyForm({ provider: 'openai', apiKey: '', isActive: true });
      setEditingApiKey(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    }
  };

  const handleApiKeyEdit = (apiKey: ApiKey) => {
    setEditingApiKey(apiKey);
    setApiKeyForm({
      provider: apiKey.provider,
      apiKey: '',
      isActive: apiKey.isActive,
    });
  };

  const handleApiKeyDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) {
      return;
    }

    try {
      await api.settings.deleteApiKey(id);
      setSuccess('API key deleted successfully');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API key');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="space-y-8">
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Tones</h2>
            <button
              onClick={() => {
                setShowToneForm(!showToneForm);
                setEditingTone(null);
                setToneForm({ name: '', description: '', systemPrompt: '' });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showToneForm ? 'Cancel' : 'Add Tone'}
            </button>
          </div>

          {showToneForm && (
            <form onSubmit={handleToneSubmit} className="mb-6 p-4 bg-gray-50 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={toneForm.name}
                    onChange={(e) => setToneForm({ ...toneForm, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={toneForm.description}
                    onChange={(e) =>
                      setToneForm({ ...toneForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Prompt
                </label>
                <textarea
                  value={toneForm.systemPrompt}
                  onChange={(e) =>
                    setToneForm({ ...toneForm, systemPrompt: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingTone ? 'Update Tone' : 'Create Tone'}
              </button>
            </form>
          )}

          <div className="space-y-3">
            {tones.map((tone) => (
              <div
                key={tone.id}
                className="p-4 border border-gray-200 rounded-md flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{tone.name}</h3>
                  {tone.description && (
                    <p className="text-sm text-gray-600 mt-1">{tone.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">{tone.systemPrompt}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleToneEdit(tone)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToneDelete(tone.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {tones.length === 0 && (
              <p className="text-gray-500 text-center py-4">No tones configured</p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">API Keys</h2>

          <form onSubmit={handleApiKeySubmit} className="mb-6 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider
                </label>
                <select
                  value={apiKeyForm.provider}
                  onChange={(e) =>
                    setApiKeyForm({ ...apiKeyForm, provider: e.target.value })
                  }
                  disabled={!!editingApiKey}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKeyForm.apiKey}
                  onChange={(e) =>
                    setApiKeyForm({ ...apiKeyForm, apiKey: e.target.value })
                  }
                  placeholder={editingApiKey ? 'Enter new key to update' : 'Enter API key'}
                  required={!editingApiKey}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={apiKeyForm.isActive}
                    onChange={(e) =>
                      setApiKeyForm({ ...apiKeyForm, isActive: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingApiKey ? 'Update Key' : 'Save Key'}
              </button>
              {editingApiKey && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingApiKey(null);
                    setApiKeyForm({ provider: 'openai', apiKey: '', isActive: true });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="p-4 border border-gray-200 rounded-md flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-900 capitalize">
                    {apiKey.provider}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        apiKey.hasKey
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {apiKey.hasKey ? 'Key Set' : 'No Key'}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        apiKey.isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {apiKey.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApiKeyEdit(apiKey)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleApiKeyDelete(apiKey.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {apiKeys.length === 0 && (
              <p className="text-gray-500 text-center py-4">No API keys configured</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

