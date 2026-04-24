import { Navbar } from '@/components/navbar';

export const metadata = {
  title: 'Privacy Policy - NotiRest',
  description: 'NotiRest privacy policy and data protection information',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              NotiRest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Personal Data (name, email address, phone number)</li>
              <li>Financial Data (billing address, payment information)</li>
              <li>Usage Data (IP address, browser type, pages visited)</li>
              <li>Device Data (device type, operating system)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Use of Your Information</h2>
            <p className="text-muted-foreground mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Email you regarding updates, news, and promotions</li>
              <li>Fulfill and manage your orders</li>
              <li>Generate a personal profile about you</li>
              <li>Increase the efficiency and operation of the Site</li>
              <li>Monitor and analyze usage and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Disclosure of Your Information</h2>
            <p className="text-muted-foreground">
              We may share information we have collected about you in certain situations: By Law, Court Order, or Government Request; if disclosure is required by law or in response to lawful requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Security of Your Information</h2>
            <p className="text-muted-foreground">
              We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions or comments about this Privacy Policy, please contact us at: privacy@notirest.io
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">Last updated: April 24, 2026</p>
        </div>
      </div>
    </div>
  );
}
