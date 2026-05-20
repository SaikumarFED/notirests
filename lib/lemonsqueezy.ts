import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

/**
 * Initializes the Lemon Squeezy SDK with the API key from environment variables.
 */
export function configureLemonSqueezy() {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  if (!apiKey) {
    console.warn('LEMON_SQUEEZY_API_KEY is not set. Lemon Squeezy will not work.');
  }

  lemonSqueezySetup({
    apiKey: apiKey || '',
    onError: (error) => console.error('Lemon Squeezy Error:', error),
  });
}
