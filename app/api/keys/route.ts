import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import crypto from 'crypto';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, label, preview, status, created_at, last_used')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ apiKeys: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { label } = await request.json();

    if (!label) {
      return NextResponse.json({ error: 'Missing label' }, { status: 400 });
    }

    // Generate secure random key
    const randomPart = crypto.randomBytes(24).toString('base64url');
    const fullKey = `nrest_${randomPart}`;
    
    // Hash key for storage
    const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');
    const preview = fullKey.substring(0, 12) + '••••••';

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        label,
        key_hash: keyHash,
        preview,
        status: 'active'
      })
      .select('id, label, preview, status, created_at, last_used')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Only return the fullKey ONCE upon creation
    return NextResponse.json({ apiKey: { ...data, fullKey } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
