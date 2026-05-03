import { Navbar } from '@/components/navbar';

export const metadata = {
  title: 'Refund Policy - NotiRest',
  description: 'NotiRest refund policy and money-back guarantee',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-foreground mb-8">Refund Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">30-Day Money-Back Guarantee</h2>
            <p className="text-muted-foreground">
              At NotiRest, we stand behind the quality of our service. If you're not completely satisfied with your purchase, we offer a full refund within 30 days of your initial purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Eligibility for Refunds</h2>
            <p className="text-muted-foreground mb-4">To be eligible for a refund:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You must request the refund within 30 days of your purchase</li>
              <li>Your account must not have been used to violate our Terms of Service</li>
              <li>You must have made a good faith attempt to use the service</li>
              <li>You must provide documentation of your dissatisfaction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Non-Refundable Items</h2>
            <p className="text-muted-foreground">
              The following are non-refundable: extended warranty purchases, custom development services, consulting hours, or any services already delivered and used.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">How to Request a Refund</h2>
            <p className="text-muted-foreground mb-4">
              To request a refund, please contact our support team at: refunds@notirest.io
            </p>
            <p className="text-muted-foreground">
              Please include your account information, purchase date, and a detailed explanation of why you would like a refund. Our team will review your request and respond within 5 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Refund Processing</h2>
            <p className="text-muted-foreground">
              Once your refund is approved, we will process it within 7 business days. The refund will be credited to the original payment method used for purchase. Depending on your bank or credit card company, it may take an additional 3-5 business days for the funds to appear in your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Subscription Cancellation</h2>
            <p className="text-muted-foreground mb-4">
              If you cancel your subscription:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You will continue to have access until the end of your billing period</li>
              <li>We will not charge you for the next billing cycle</li>
              <li>You can reactivate your subscription at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              For any questions about our refund policy, please contact: support@notirest.io
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">Last updated: April 24, 2026</p>
        </div>
      </div>
    </div>
  );
}
