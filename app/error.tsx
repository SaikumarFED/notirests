'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
