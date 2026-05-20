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
  const [loading, setLoading] = useState(true);
  const [notionConnected, setNotionConnected] = useState(false);

  // Load real data on mount
  useEffect(() => {
    setMounted(true);
    
    const fetchData = async () => {
      try {
        const [connRes, keysRes, usageRes, statusRes] = await Promise.all([
          fetch('/api/connections'),
          fetch('/api/keys'),
          fetch('/api/usage'),
          fetch('/api/workspace-status')
        ]);
        
        if (connRes.ok) {
          const data = await connRes.json();
          setConnections(data);
        }
        
        if (keysRes.ok) {
          const data = await keysRes.json();
          setApiKeys(data);
        }
        
        if (usageRes.ok) {
          const data = await usageRes.json();
          // Assuming usageRes returns last 7 days, sum them up for "today" or total
          const todayCalls = data.length > 0 ? data[data.length - 1].calls : 0;
          setApiCallsToday(todayCalls);
        }

        if (statusRes.ok) {
          const data = await statusRes.json();
          setNotionConnected(data.connected);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
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
            <div className="p-8 bg-card border border-border rounded-2xl">
              <h3 className="text-lg font-bold text-foreground mb-4">Onboarding Checklist</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Complete these steps to get your first Notion API up and running.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${notionConnected ? 'bg-green-500 text-white' : 'bg-muted border border-border'}`}>
                    {notionConnected && <span className="text-xs">✓</span>}
                  </div>
                  <span className={notionConnected ? 'text-foreground line-through opacity-70' : 'text-foreground font-medium'}>
                    Connect your Notion workspace
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${hasConnections ? 'bg-green-500 text-white' : 'bg-muted border border-border'}`}>
                    {hasConnections && <span className="text-xs">✓</span>}
                  </div>
                  <span className={hasConnections ? 'text-foreground line-through opacity-70' : 'text-foreground font-medium'}>
                    Create your first endpoint
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${apiKeys.length > 0 ? 'bg-green-500 text-white' : 'bg-muted border border-border'}`}>
                    {apiKeys.length > 0 && <span className="text-xs">✓</span>}
                  </div>
                  <span className={apiKeys.length > 0 ? 'text-foreground line-through opacity-70' : 'text-foreground font-medium'}>
                    Generate an API key
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${apiCallsToday > 0 ? 'bg-green-500 text-white' : 'bg-muted border border-border'}`}>
                    {apiCallsToday > 0 && <span className="text-xs">✓</span>}
                  </div>
                  <span className={apiCallsToday > 0 ? 'text-foreground line-through opacity-70' : 'text-foreground font-medium'}>
                    Make your first API call
                  </span>
                </div>
              </div>
              {!notionConnected && (
                <Button asChild className="mt-8 w-full bg-primary hover:bg-primary/90">
                  <Link href="/api/auth/notion" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Connect Notion Now
                  </Link>
                </Button>
              )}
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
