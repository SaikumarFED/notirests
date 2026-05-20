import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { configureLemonSqueezy } from '@/lib/lemonsqueezy';
import { cancelSubscription } from '@lemonsqueezy/lemonsqueezy.js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('ls_subscription_id')
      .eq('id', user.id)
      .single();

    if (!profile?.ls_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    configureLemonSqueezy();

    const result = await cancelSubscription(profile.ls_subscription_id);

    if (result.error) {
      console.error('Cancel subscription error:', result.error);
      return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }

    // We'll let the webhook handle updating the DB status to cancelled
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
