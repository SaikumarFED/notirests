'use client';

import { Button } from '@/components/ui/button';
import { Plus, Copy, Trash2, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Endpoint {
  id: string;
  name: string;
  databaseId: string;
  slug: string;
  status: 'active' | 'error';
}

export default function EndpointsPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    databaseId: '',
    slug: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load endpoints from API on mount
  useEffect(() => {
    setMounted(true);
    const fetchEndpoints = async () => {
      try {
        const res = await fetch('/api/connections');
        if (res.ok) {
          const { connections } = await res.json();
          setEndpoints(connections || []);
        }
      } catch (error) {
        console.error('Failed to load endpoints:', error);
      }
    };
    fetchEndpoints();
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
    if (errors.name) {
      setErrors({ ...errors, name: '' });
    }
  };

  const handleDatabaseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, databaseId: e.target.value });
    if (errors.databaseId) {
      setErrors({ ...errors, databaseId: '' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTest = async () => {
    if (!formData.name || !formData.databaseId) {
      setErrors({
        name: !formData.name ? 'Connection name required' : '',
        databaseId: !formData.databaseId ? 'Database ID required' : '',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    // Simulate testing
    setTimeout(() => {
      setTesting(false);
      setTestResult('success');
      setTimeout(() => setTestResult(null), 4000);
    }, 1500);
  };

  const handleCreate = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Connection name required';
    if (!formData.databaseId) newErrors.databaseId = 'Database ID required';
    if (!formData.slug) newErrors.slug = 'Slug required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          databaseId: formData.databaseId,
          slug: formData.slug,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ slug: data.error || 'Failed to create connection' });
        return;
      }

      setEndpoints([data.connection, ...endpoints]);
      setFormData({ name: '', databaseId: '', slug: '' });
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ slug: 'Network error occurred' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/connections/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEndpoints(endpoints.filter((ep) => ep.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
    setShowDeleteConfirm(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">API Endpoints</h1>
        <p className="text-muted-foreground">Manage your Notion database API endpoints.</p>
      </div>

      {/* Connection Form */}
      <div className="mb-12 p-8 bg-card border border-border rounded-2xl">
        <h2 className="text-xl font-bold text-foreground mb-6">Connect a Notion Database</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Connection Name *</label>
            <input
              type="text"
              placeholder="e.g., Product Database"
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Notion Database ID *</label>
            <input
              type="text"
              placeholder="e.g., 123abc456def"
              value={formData.databaseId}
              onChange={handleDatabaseIdChange}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Find this in your Notion database URL: notion.so/workspace/
              <span className="font-mono font-semibold">123abc456def</span>?v=...
            </p>
            {errors.databaseId && <p className="text-xs text-red-600 mt-1">{errors.databaseId}</p>}
          </div>

          {formData.slug && (
            <div className="p-3 bg-secondary border border-border rounded-lg">
              <p className="text-xs text-muted-foreground">Your endpoint will be:</p>
              <p className="font-mono font-semibold text-foreground">https://notirest.io/api/{formData.slug}</p>
            </div>
          )}

          {testResult === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-800">
                Connection format valid. Add your Notion API key in Settings to go live.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing || !formData.name || !formData.databaseId}
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleCreate}
              disabled={!formData.name || !formData.databaseId}
            >
              Create Endpoint
            </Button>
          </div>
        </div>
      </div>

      {/* Endpoints List */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">Active Endpoints</h2>

        {endpoints.length === 0 ? (
          <div className="text-center p-12 bg-card border border-border rounded-2xl">
            <p className="text-muted-foreground">No endpoints yet. Create your first connection above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className="p-6 bg-card border border-border rounded-2xl hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-foreground">{endpoint.name}</p>
                    <p className="text-sm text-muted-foreground">{endpoint.database_id || endpoint.databaseId}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(endpoint.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mb-4 space-y-2">
                  {['GET', 'POST', 'PATCH', 'DELETE'].map((method) => (
                    <div key={method} className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded">
                        {method}
                      </span>
                      <span className="font-mono text-sm text-foreground">https://notirest.io/api/{endpoint.slug}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`https://notirest.io/api/${endpoint.slug}`)}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copied === `https://notirest.io/api/${endpoint.slug}` ? 'Copied!' : 'Copy URL'}
                  </Button>
                  <Button variant="outline" size="sm">
                    Try it Out
                  </Button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === endpoint.id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 mb-4">
                      Are you sure you want to delete this endpoint? This cannot be undone.
                    </p>
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
                        onClick={() => handleDelete(endpoint.id)}
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
      </div>
    </div>
  );
}
