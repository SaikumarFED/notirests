'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Get started with NotiRest',
    cta: 'Get Started',
    highlighted: false,
    features: [
      { name: '1 Notion Connection', included: true },
      { name: '1,000 API Calls/month', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Community Support', included: true },
      { name: 'Advanced Analytics', included: false },
      { name: 'Priority Email Support', included: false },
      { name: 'Custom Domains', included: false },
      { name: 'WebHooks', included: false },
      { name: 'SLA Guarantee', included: false },
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: 'For growing teams',
    cta: 'Start Pro Trial',
    highlighted: true,
    features: [
      { name: 'Unlimited Connections', included: true },
      { name: '50,000 API Calls/month', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Priority Email Support', included: true },
      { name: 'Full CRUD Support', included: true },
      { name: 'Schema Change Alerts', included: true },
      { name: 'Versioned Endpoints', included: true },
      { name: 'Custom Domains', included: false },
      { name: 'SLA Guarantee', included: false },
    ],
  },
  {
    name: 'Agency',
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: 'For large organizations',
    cta: 'Contact Sales',
    highlighted: false,
    features: [
      { name: 'Unlimited Everything', included: true },
      { name: '500,000 API Calls/month', included: true },
      { name: 'Priority Support', included: true },
      { name: 'White Label Options', included: true },
      { name: 'Custom Rate Limits', included: true },
      { name: 'Dedicated Account Manager', included: true },
      { name: 'Advanced Security', included: true },
      { name: '99.99% Uptime SLA', included: true },
      { name: 'Custom Integrations', included: true },
    ],
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const getPrice = (plan: typeof pricingPlans[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getYearlyTotal = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8); // 20% discount
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Choose the perfect plan for your needs. Always flexible, always fair.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="inline-flex p-1 bg-card border border-border rounded-2xl">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  !isYearly
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  isYearly
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                Yearly
              </button>
            </div>
            {isYearly && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                Save 2 months free
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan) => {
            const price = getPrice(plan);
            const yearlyTotal = isYearly ? getYearlyTotal(plan.monthlyPrice) : null;
            
            return (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.highlighted
                    ? 'bg-card border-primary shadow-lg shadow-primary/20 md:scale-105'
                    : 'bg-card border-border'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary px-4 py-1 rounded-full">
                    <span className="text-sm font-semibold text-primary-foreground">Most Popular</span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">${price}</span>
                    <span className="text-muted-foreground">{isYearly ? '/month' : '/month'}</span>
                  </div>
                  {isYearly && plan.monthlyPrice > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Billed ${yearlyTotal}/year
                    </p>
                  )}
                </div>

                <Button
                  asChild
                  className={`w-full mb-8 ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  <Link href="/signup">{plan.cta}</Link>
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: 'Can I change plans anytime?',
                answer:
                  'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we handle prorated billing.',
              },
              {
                question: 'Do you offer discounts for annual billing?',
                answer:
                  'Yes, annual plans are 20% cheaper than monthly billing. You also get access to additional features and priority support.',
              },
              {
                question: 'What happens if I exceed my API limits?',
                answer:
                  'We will notify you before hitting your limit. You can either upgrade your plan or purchase additional API calls a la carte.',
              },
              {
                question: 'Is there a free trial?',
                answer:
                  'Yes! All Pro and Enterprise plans come with a 14-day free trial. No credit card required to start.',
              },
              {
                question: 'Do you offer custom plans?',
                answer:
                  'Absolutely. Contact our sales team if you need a custom plan tailored to your specific requirements.',
              },
              {
                question: 'What payment methods do you accept?',
                answer:
                  'We accept all major credit cards (Visa, Mastercard, American Express), wire transfers, and purchase orders for Enterprise customers.',
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group p-6 bg-card border border-border rounded-lg cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-foreground">
                  {faq.question}
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 p-12 bg-card border border-border rounded-xl text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to get started?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of developers using NotiRest. Start free, no credit card required.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
