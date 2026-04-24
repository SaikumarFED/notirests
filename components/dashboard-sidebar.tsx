'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, KeyRound, Database, TrendingUp, CreditCard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: BarChart3, label: 'Overview', href: '/dashboard' },
  { icon: Database, label: 'Endpoints', href: '/dashboard/endpoints' },
  { icon: KeyRound, label: 'API Keys', href: '/dashboard/api-keys' },
  { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent via-accent/60 to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">NotiRest</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-6 border-t border-sidebar-border space-y-4">
        <div className="px-4 py-3 bg-sidebar-accent rounded-lg">
          <p className="text-xs text-sidebar-accent-foreground opacity-60">Signed in as</p>
          <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">
            {profile?.full_name || profile?.email}
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
