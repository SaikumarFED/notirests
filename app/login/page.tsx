'use client';

import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { signIn } from '@/lib/supabase';

export default function LoginPage() {
  const handleLogin = async (email: string, password: string) => {
    await signIn(email, password);
  };

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-gradient-to-br from-primary via-primary/60 to-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-lg text-foreground">NotiRest</span>
          </Link>

          {/* Content */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue building.
            </p>
          </div>

          <AuthForm mode="login" onSubmit={handleLogin} />

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:text-primary/80">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-card border-l border-border">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Build with Notion data instantly
          </h2>

          <div className="space-y-8">
            {[
              {
                title: 'Connect in Seconds',
                description:
                  'Link your Notion workspace and select the databases you want to expose as APIs.',
              },
              {
                title: 'Automatic API Generation',
                description:
                  'Your REST API is automatically generated with full CRUD operations and filtering.',
              },
              {
                title: 'Production Ready',
                description:
                  'Built-in authentication, rate limiting, analytics, and all the tools you need for production.',
              },
            ].map((feature, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-8 pt-12 border-t border-border">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2000+</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">1M+</div>
            <p className="text-sm text-muted-foreground">API Calls/day</p>
          </div>
        </div>
      </div>
    </div>
  );
}
