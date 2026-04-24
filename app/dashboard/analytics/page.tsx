'use client';

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

const chartData = [
  { date: 'Apr 18', requests: 0, errors: 0, avgResponse: 0 },
  { date: 'Apr 19', requests: 0, errors: 0, avgResponse: 0 },
  { date: 'Apr 20', requests: 0, errors: 0, avgResponse: 0 },
  { date: 'Apr 21', requests: 0, errors: 0, avgResponse: 0 },
  { date: 'Apr 22', requests: 0, errors: 0, avgResponse: 0 },
  { date: 'Apr 23', requests: 0, errors: 0, avgResponse: 0 },
  { date: 'Apr 24', requests: 0, errors: 0, avgResponse: 0 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  const hasData = chartData.some((d) => d.requests > 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Monitor your API usage and performance.</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
              className={dateRange === range ? 'bg-primary' : ''}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="text-center p-12 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground mb-4">
            No API calls yet. Connect a database and make your first API call to see analytics.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-card border border-border rounded-2xl">
              <p className="text-muted-foreground text-sm font-semibold mb-2">Total Requests ({dateRange})</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl">
              <p className="text-muted-foreground text-sm font-semibold mb-2">Avg Response Time</p>
              <p className="text-3xl font-bold text-foreground">0ms</p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl">
              <p className="text-muted-foreground text-sm font-semibold mb-2">Error Rate</p>
              <p className="text-3xl font-bold text-foreground">0%</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Requests Chart */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-lg font-bold text-foreground mb-6">API Requests</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Response Time Chart */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-lg font-bold text-foreground mb-6">Avg Response Time (ms)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgResponse" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
