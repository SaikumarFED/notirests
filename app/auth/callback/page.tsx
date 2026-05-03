'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the OAuth callback
        await supabase.auth.getSession();
        router.push('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-border border-t-accent animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
