'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Navbar() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <Image
              src="/favicon.ico"
              alt="NotiRest Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-lg text-foreground hidden sm:inline">NotiRest</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition">
              Documentation
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {profile?.full_name || profile?.email || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
