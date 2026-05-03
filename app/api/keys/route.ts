import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

function generateRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch keys error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  const formatted = data.map(d => ({
    id: d.id,
    label: d.label,
    fullKey: '', // Masked
    preview: d.key.slice(0, 12) + '••••••',
    status: d.is_active ? 'active' : 'revoked',
    createdAt: new Date(d.created_at).toLocaleDateString(),
    lastUsed: d.last_used ? new Date(d.last_used).toLocaleDateString() : null,
  }));

  return NextResponse.json(formatted);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { label } = body;

  if (!label) {
    return new NextResponse('Missing label', { status: 400 });
  }

  const rawKey = `nrest_${generateRandomString(32)}`;

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.id,
      label,
      key: rawKey,
    })
    .select()
    .single();

  if (error) {
    console.error('Create key error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    label: data.label,
    fullKey: rawKey, // Send once
    preview: rawKey.slice(0, 12) + '••••••',
    status: 'active',
    createdAt: new Date(data.created_at).toLocaleDateString(),
    lastUsed: null,
  });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete key error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  return NextResponse.json({ success: true });
}
