'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Database, KeyRound, Zap, BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';

interface Connection {
  id: string;
  name: string;
  databaseId: string;
  status: 'active' | 'error';
  createdAt: string;
}

export default function DashboardOverview() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [apiCallsToday, setApiCallsToday] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Fetch real data from API
  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        const [connRes, keysRes] = await Promise.all([
          fetch('/api/connections'),
          fetch('/api/keys')
        ]);
        
        if (connRes.ok) {
          const { connections } = await connRes.json();
          setConnections(connections || []);
        }
        
        if (keysRes.ok) {
          const { apiKeys } = await keysRes.json();
          setApiKeys(apiKeys || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const hasConnections = connections.length > 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your API overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground text-sm font-semibold">API Calls Today</h3>
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{apiCallsToday}</p>
          <p className="text-xs text-muted-foreground mt-2">0 so far today</p>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground text-sm font-semibold">Connections</h3>
            <Database className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{connections.length}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {connections.length === 0 ? 'No connections yet' : 'All healthy'}
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground text-sm font-semibold">API Keys</h3>
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{apiKeys.length}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {apiKeys.length === 0 ? 'No keys yet' : 'Active keys'}
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground text-sm font-semibold">Uptime</h3>
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">99.9%</p>
          <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
        </div>
      </div>

      {/* Recent Connections / Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Recent Connections */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Connections</h2>
            {hasConnections && (
              <Link href="/dashboard/endpoints" className="text-primary hover:text-primary/80 text-sm font-semibold">
                View All
              </Link>
            )}
          </div>

          {hasConnections ? (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="p-4 bg-card border border-border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{connection.name}</p>
                    <p className="text-sm text-muted-foreground">{connection.databaseId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-muted-foreground capitalize">{connection.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-card border border-border rounded-2xl text-center">
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-6">
                No connections yet. Connect your first Notion database to get started.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard/endpoints" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Connection
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full justify-start bg-primary hover:bg-primary/90 h-auto p-4">
              <Link href="/dashboard/endpoints" className="flex items-center gap-3">
                <Database className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold text-primary-foreground">Add New Connection</div>
                  <div className="text-xs opacity-80 text-primary-foreground">Connect a Notion database</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full justify-start h-auto p-4">
              <Link href="/dashboard/api-keys" className="flex items-center gap-3">
                <KeyRound className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Generate API Key</div>
                  <div className="text-xs opacity-80">Create authentication key</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full justify-start h-auto p-4">
              <Link href="/docs" className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">View Documentation</div>
                  <div className="text-xs opacity-80">Learn API best practices</div>
                </div>
              </Link>
            </Button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-secondary border border-border rounded-2xl">
            <p className="text-sm text-muted-foreground">
              Get the most out of NotiRest by connecting your Notion workspace and monitoring your API usage in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
