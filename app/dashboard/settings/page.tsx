'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    company: profile?.company_name || '',
  });
  
  const handleSave = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          company_name: formData.company,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Save profile error:', error);
    }
  };
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    highUsageAlerts: true,
    weeklySummary: true,
    announcements: false,
    updates: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Settings */}
          <div className="p-8 bg-card border border-border rounded-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Profile Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-muted-foreground opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Email cannot be changed. Contact support if you need to update this.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleSave}
              >
                {saved ? '✓ Changes Saved' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="p-8 bg-card border border-border rounded-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Security</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Password</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Change your password to keep your account secure.
                </p>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account with 2FA.
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-2">Active Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your active sessions and sign out from other devices.
                </p>
                <div className="space-y-3">
                  {[
                    { name: 'Chrome on macOS', lastSeen: 'Active now' },
                    { name: 'Safari on iPhone', lastSeen: '2 hours ago' },
                  ].map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary border border-border rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{session.name}</p>
                        <p className="text-xs text-muted-foreground">{session.lastSeen}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        Sign Out
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-8 bg-card border border-border rounded-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Notifications</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-lg cursor-pointer hover:border-border/80 transition">
                <input
                  type="checkbox"
                  checked={notifications.highUsageAlerts}
                  onChange={(e) => setNotifications({ ...notifications, highUsageAlerts: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Email alerts for high API usage</span>
              </label>
              <label className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-lg cursor-pointer hover:border-border/80 transition">
                <input
                  type="checkbox"
                  checked={notifications.weeklySummary}
                  onChange={(e) => setNotifications({ ...notifications, weeklySummary: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Weekly analytics summary</span>
              </label>
              <label className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-lg cursor-pointer hover:border-border/80 transition">
                <input
                  type="checkbox"
                  checked={notifications.announcements}
                  onChange={(e) => setNotifications({ ...notifications, announcements: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-foreground">New feature announcements</span>
              </label>
              <label className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-lg cursor-pointer hover:border-border/80 transition">
                <input
                  type="checkbox"
                  checked={notifications.updates}
                  onChange={(e) => setNotifications({ ...notifications, updates: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Product updates and news</span>
              </label>

              <Button className="bg-primary hover:bg-primary/90 w-full">Save Preferences</Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Danger Zone */}
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-bold text-red-800">Danger Zone</h3>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100">
                Export Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>

            <p className="text-xs text-red-700 mt-4">
              Deleting your account is permanent and cannot be undone.
            </p>
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-foreground">Delete Account?</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                    Delete My Account
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Support */}
          <div className="p-6 bg-card border border-border rounded-2xl">
            <h3 className="text-lg font-bold text-foreground mb-4">Support</h3>

            <div className="space-y-3 text-sm">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/docs">Documentation</a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="#">Contact Support</a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="#">Report Bug</a>
              </Button>
            </div>
          </div>

          {/* Account Info */}
          <div className="p-6 bg-card border border-border rounded-2xl">
            <h3 className="text-lg font-bold text-foreground mb-4">Account Info</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">User ID</p>
                <p className="font-mono text-xs text-foreground break-all">
                  {profile?.id || 'Loading...'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Plan</p>
                <p className="font-semibold text-foreground capitalize">
                  {profile?.subscription_tier || 'Free'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="text-foreground">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
