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

  const generateKey = () => {
    if (!newKeyLabel) return;

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let randomPart = '';

    for (let i = 0; i < 32; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // safer prefix (not flagged by GitHub)
    const fullKey = `demo_${randomPart}`;

    const newKey: APIKey = {
      id: `key-${Date.now()}`,
      label: newKeyLabel,
      fullKey,
      preview: fullKey.slice(0, 12) + '••••••',
      createdAt: new Date().toLocaleDateString(),
      lastUsed: null,
      status: 'active',
    };

    setGeneratedKey(newKey);
    setKeySaved(false);
  };

  const confirmSaveKey = () => {
    if (!generatedKey) return;

    setApiKeys([...apiKeys, generatedKey]);
    setGeneratedKey(null);
    setNewKeyLabel('');
    setShowGenerateModal(false);
    setKeySaved(false);
  };

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key: APIKey) => key.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">API Keys</h1>
          <p className="text-muted-foreground">
            Create and manage API keys for authentication.
          </p>
        </div>

        <Button
          onClick={() => setShowGenerateModal(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Generate Key
        </Button>
      </div>

      {/* Warning */}
      <div className="mb-12 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-900">
            Keep your API keys secure.
          </p>
          <p className="text-sm text-yellow-800">
            Never commit them publicly. Revoke immediately if compromised.
          </p>
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-2xl w-full max-w-md p-6">
            {!generatedKey ? (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Generate New API Key
                </h2>

                <input
                  type="text"
                  placeholder="Production / Dev / Testing"
                  value={newKeyLabel}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKeyLabel(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-4"
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowGenerateModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={generateKey}
                    disabled={!newKeyLabel}
                  >
                    Generate
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Your API Key
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="font-mono text-sm break-all">
                    {generatedKey.fullKey}
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">
                    Save this key now. You won't see it again.
                  </p>
                </div>

                <label className="flex gap-2 items-center mb-4">
                  <input
                    type="checkbox"
                    checked={keySaved}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeySaved(e.target.checked)}
                  />
                  <span className="text-sm">
                    I've saved my key
                  </span>
                </label>

                <Button
                  className="w-full"
                  disabled={!keySaved}
                  onClick={confirmSaveKey}
                >
                  Continue
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {apiKeys.length === 0 ? (
        <div className="text-center border rounded-2xl p-12">
          <p className="text-muted-foreground mb-6">
            No API keys yet.
          </p>

          <Button
            onClick={() => setShowGenerateModal(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate First Key
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key: APIKey) => (
            <div
              key={key.id}
              className="border rounded-2xl p-6"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {key.label}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Created {key.createdAt}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setShowDeleteConfirm(key.id)
                  }
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 border rounded-lg px-4 py-3 font-mono text-sm">
                  {showKey === key.id
                    ? key.fullKey
                    : key.preview}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowKey(
                      showKey === key.id ? null : key.id
                    )
                  }
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
                  onClick={() =>
                    copyToClipboard(key.fullKey)
                  }
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied === key.fullKey
                    ? 'Copied!'
                    : 'Copy'}
                </Button>
              </div>

              {showDeleteConfirm === key.id && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm mb-3">
                    Delete this key?
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setShowDeleteConfirm(null)
                      }
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
        <div className="mt-12 border rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-4">
            How to Use Your API Key
          </h2>

          <div className="bg-black text-white rounded-lg p-4 font-mono text-sm overflow-x-auto">
            {`fetch('https://yourdomain.com/api/example', {
  headers: {
    'x-api-key': 'demo_your_key_here'
  }
})`}
          </div>
        </div>
      )}
    </div>
  );
}