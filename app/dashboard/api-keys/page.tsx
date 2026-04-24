'use client';

import { Button } from '@/components/ui/button';
import { Plus, Copy, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface APIKey {
  id: string;
  label: string;
  fullKey: string;
  preview: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
}

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [generatedKey, setGeneratedKey] = useState<APIKey | null>(null);
  const [keySaved, setKeySaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await fetch('/api/keys');
        if (res.ok) {
          const { apiKeys } = await res.json();
          setApiKeys(apiKeys || []);
        }
      } catch (err) {
        console.error('Failed to load keys', err);
      }
    };
    fetchKeys();
  }, []);

  const generateKey = async () => {
    if (!newKeyLabel) return;
    
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newKeyLabel }),
      });
      
      if (res.ok) {
        const { apiKey } = await res.json();
        setGeneratedKey(apiKey);
        setKeySaved(false);
      }
    } catch (err) {
      console.error('Failed to generate key', err);
    }
  };

  const confirmSaveKey = () => {
    if (generatedKey) {
      setApiKeys([generatedKey, ...apiKeys]);
      setGeneratedKey(null);
      setNewKeyLabel('');
      setShowGenerateModal(false);
      setKeySaved(false);
    }
  };

  const deleteKey = async (id: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
    setShowDeleteConfirm(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">API Keys</h1>
          <p className="text-muted-foreground">Create and manage API keys for authentication.</p>
        </div>
        <Button
          onClick={() => setShowGenerateModal(true)}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Generate Key
        </Button>
      </div>

      {/* Security Warning */}
      <div className="mb-12 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-900 font-semibold">Keep your API keys secure.</p>
          <p className="text-sm text-amber-800">
            Never commit them to version control or share them publicly. If a key is compromised, revoke it immediately.
          </p>
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6">
            {!generatedKey ? (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-4">Generate New API Key</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Label for this key
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Production, Development, Testing"
                      value={newKeyLabel}
                      onChange={(e) => setNewKeyLabel(e.target.value)}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={generateKey}
                      disabled={!newKeyLabel}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-4">Your API Key</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="font-mono text-sm text-green-900 break-all">{generatedKey.fullKey}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-red-800">
                    <strong>Save this key now.</strong> You will never see it again.
                  </p>
                </div>
                <label className="flex items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    checked={keySaved}
                    onChange={(e) => setKeySaved(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-foreground font-semibold">I&apos;ve saved my key</span>
                </label>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={confirmSaveKey}
                  disabled={!keySaved}
                >
                  Continue
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <div className="text-center p-12 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground mb-6">
            No API keys yet. Generate your first key to start making API calls.
          </p>
          <Button
            onClick={() => setShowGenerateModal(true)}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate First Key
          </Button>
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {apiKeys.map((key) => (
            <div key={key.id} className="p-6 bg-card border border-border rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{key.label}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        key.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {key.status === 'active' ? 'Active' : 'Revoked'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(key.created_at || key.createdAt).toLocaleDateString()} • {key.last_used || key.lastUsed ? `Last used ${new Date(key.last_used || key.lastUsed).toLocaleString()}` : 'Never used'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    {/* Regenerate */}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(key.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 font-mono text-sm">
                  {showKey === key.id ? key.fullKey : key.preview}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                >
                  {showKey === key.id ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(key.fullKey)}
                >
                  <Copy className="w-4 h-4" />
                  {copied === key.fullKey ? 'Copied!' : 'Copy'}
                </Button>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm === key.id && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 mb-4">Are you sure you want to delete this key?</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => deleteKey(key.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Usage Example */}
      {apiKeys.length > 0 && (
        <div className="p-8 bg-card border border-border rounded-2xl">
          <h2 className="text-xl font-bold text-foreground mb-4">How to Use Your API Key</h2>

          <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
            <p className="text-gray-500">// Using x-api-key header (recommended)</p>
            <p>
              <span className="text-blue-400">fetch</span>(
              <span className="text-green-400">
                &apos;https://notirest.io/api/your-endpoint&apos;
              </span>
              , {'{'}
            </p>
            <p className="ml-4">
              <span className="text-orange-400">headers</span>: {'{'}
            </p>
            <p className="ml-8">
              <span className="text-green-400">&apos;x-api-key&apos;</span>:{' '}
              <span className="text-green-400">&apos;nrest_your_key_here&apos;</span>
            </p>
            <p className="ml-4">{'}'}</p>
            <p>{'}'}</p>
            <p>)</p>
          </div>
        </div>
      )}
    </div>
  );
}
