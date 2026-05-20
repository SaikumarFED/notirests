'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/60 to-primary rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg">
        <span className="text-white font-bold text-2xl">N</span>
      </div>
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-6">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <Link href="/dashboard">
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
