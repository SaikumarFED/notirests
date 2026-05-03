import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { DatabasePreview } from '@/components/database-preview';
import Link from 'next/link';
import { ArrowRight, Check, Zap, Shield, Code2 } from 'lucide-react';

export const metadata = {
  title: 'NotiRest - Turn Notion Databases Into REST APIs | Production-Ready',
  description: 'Connect your Notion databases and generate production-ready REST APIs in seconds. No coding required. Perfect for developers and teams.',
  keywords: 'Notion API, REST API, database API, Notion integration, API generator, serverless API, low-code',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-card border border-border rounded-full mb-6 animate-fade-in-up">
            <span className="text-sm text-muted-foreground">
              <span className="text-primary font-semibold">Now in Open Beta</span> - Get started free
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Turn Your Notion Database Into a{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Production API
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Connect your Notion workspace, generate REST APIs in seconds, and integrate with any application. No coding required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-base">
              <Link href="/signup" className="flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>

          {/* Database Preview */}
          <div className="mb-20">
            <DatabasePreview />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Built for developers, designed for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-background border border-border rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Instant APIs</h3>
              <p className="text-muted-foreground">
                Generate REST APIs from your Notion database in seconds. No configuration needed.
              </p>
            </div>

            <div className="p-8 bg-background border border-border rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Full Schema Support</h3>
              <p className="text-muted-foreground">
                All Notion field types are fully supported with proper data transformations.
              </p>
            </div>

            <div className="p-8 bg-background border border-border rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground">
                API keys, rate limiting, and all security best practices included by default.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Scale from startup to enterprise
          </p>
          <Button variant="outline" asChild>
            <Link href="/pricing">View Full Pricing</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Free',
              price: '$0',
              description: 'Get started with NotiRest',
              features: ['1 Notion Connection', '1000 API Calls/month', 'Basic Analytics', 'Community Support'],
            },
            {
              name: 'Pro',
              price: '$29',
              description: 'For growing teams',
              features: ['Unlimited Connections', '100K API Calls/month', 'Advanced Analytics', 'Priority Support', 'Custom Domains'],
              highlighted: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              description: 'For large organizations',
              features: ['Unlimited Everything', 'SLA Guarantee', 'Dedicated Support', 'Custom Integration', 'Advanced Security'],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl border ${
                plan.highlighted
                  ? 'bg-card border-primary shadow-lg shadow-primary/20'
                  : 'bg-background border-border'
              }`}
            >
              <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.name !== 'Enterprise' && <span className="text-muted-foreground">/month</span>}
              </div>
              <Button
                asChild
                className={`w-full mb-8 ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
                variant={plan.highlighted ? 'default' : 'outline'}
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Build?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of developers using NotiRest to power their applications.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/signup" className="flex items-center gap-2">
              Start Free Today <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">NotiRest</h4>
              <p className="text-sm text-muted-foreground">
                Turn your Notion databases into REST APIs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-foreground transition">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api" className="hover:text-foreground transition">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground text-center">
              © 2024 NotiRest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
