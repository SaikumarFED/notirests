'use client';

import { Button } from '@/components/ui/button';
import { Check, Download, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'agency'>('free');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [billingHistory] = useState([
    {
      date: 'April 24, 2024',
      description: 'Free Plan',
      amount: '$0.00',
      status: 'Complimentary',
    },
  ]);

  const plans = {
    free: { name: 'Free', price: 0, calls: 1000 },
    pro: { name: 'Pro', price: 19, calls: 50000 },
    agency: { name: 'Agency', price: 49, calls: 500000 },
  };

  const currentPlanInfo = plans[currentPlan];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="lg:col-span-2">
          <div className="p-8 bg-card border border-border rounded-2xl mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Current Plan</h2>

            <div className="mb-8">
              <p className="text-muted-foreground text-sm mb-2">You&apos;re on the</p>
              <p className="text-3xl font-bold text-foreground mb-4">{currentPlanInfo.name} Plan</p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{currentPlanInfo.calls.toLocaleString()} API Calls/month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-foreground">
                    {currentPlan === 'free' ? '1 Notion Connection' : 'Unlimited Connections'}
                  </span>
                </div>
                {currentPlan !== 'free' && (
                  <>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-foreground">Advanced Analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-foreground">Priority Support</span>
                    </div>
                  </>
                )}
              </div>

              <p className="text-2xl font-bold text-foreground mb-2">${currentPlanInfo.price}.00</p>
              <p className="text-muted-foreground text-sm mb-6">
                Billed monthly • Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>

              <div className="space-y-3">
                {currentPlan !== 'free' && (
                  <>
                    <Button variant="outline" className="w-full justify-start">
                      Manage Billing Details
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel Subscription
                    </Button>
                  </>
                )}
                {currentPlan === 'free' && (
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="p-8 bg-card border border-border rounded-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Billing History</h2>

            {billingHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No billing history yet.</p>
            ) : (
              <div className="space-y-4">
                {billingHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{item.description}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold text-foreground">{item.amount}</p>
                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded">
                        {item.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cancel Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-foreground">Cancel Subscription?</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Your subscription will be canceled at the end of the current billing cycle. You will lose access to premium features.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowCancelModal(false)} className="flex-1">
                    Keep Subscription
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                    Cancel Anyway
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Comparison Sidebar */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Other Plans</h3>
          <div className="space-y-3">
            {(['free', 'pro', 'agency'] as const).map((plan) => (
              <button
                key={plan}
                onClick={() => setCurrentPlan(plan)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  currentPlan === plan
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <p className="font-bold text-foreground capitalize">{plan} Plan</p>
                <p className="text-sm text-muted-foreground">${plans[plan].price}/month</p>
              </button>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="mt-8 p-6 bg-card border border-border rounded-2xl">
            <h3 className="font-bold text-foreground mb-4">Payment Methods</h3>
            <p className="text-sm text-muted-foreground mb-4">No payment methods added yet.</p>
            <Button variant="outline" className="w-full">
              Add Payment Method
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
