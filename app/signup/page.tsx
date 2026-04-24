'use client';

import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { signUp } from '@/lib/supabase';

export default function SignupPage() {
  const handleSignup = async (email: string, password: string, fullName?: string) => {
    await signUp(email, password, fullName);
  };

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 md:grid-cols-2">
      {/* Right side - Benefits */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-card border-r border-border">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Launch Your API in Minutes
          </h2>

          <div className="space-y-8">
            {[
              {
                title: 'No Code Required',
                description:
                  'Our intuitive UI guides you through connecting your Notion database and generates APIs automatically.',
              },
              {
                title: 'Enterprise Features',
                description:
                  'API keys, rate limiting, analytics, WebHooks, and more—everything included from day one.',
              },
              {
                title: 'Scale with Confidence',
                description:
                  'Built on reliable infrastructure with 99.9% uptime SLA. Handle millions of requests with ease.',
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

        {/* Testimonial */}
        <div className="mt-12 pt-12 border-t border-border">
          <p className="text-muted-foreground italic mb-4">
            &quot;NotiRest saved us weeks of development time. We connected our Notion databases and had a production API running within minutes.&quot;
          </p>
          <div>
            <p className="font-semibold text-foreground">Sarah Chen</p>
            <p className="text-sm text-muted-foreground">Founder, TechStartup Inc</p>
          </div>
        </div>
      </div>

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Start building Notion APIs in minutes. Free forever for the Free plan.
            </p>
          </div>

          <AuthForm mode="signup" onSubmit={handleSignup} />

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            By signing up, you agree to our{' '}
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
    </div>
  );
}
