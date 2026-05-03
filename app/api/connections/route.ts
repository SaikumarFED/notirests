import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data, error } = await supabase
    .from('connections')
    .select('id, name:label, databaseId:notion_database_id, slug, status:is_active, createdAt:created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch connections error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  // Map to the format UI expects
  const formatted = data.map(d => ({
    id: d.id,
    name: d.name,
    databaseId: d.databaseId,
    slug: d.slug,
    status: 'active',
    createdAt: new Date(d.createdAt).toLocaleDateString(),
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
  const { name, databaseId, slug } = body;

  if (!name || !databaseId || !slug) {
    return new NextResponse('Missing required fields', { status: 400 });
  }

  // Retrieve token from cookie (saved during OAuth callback)
  const token = request.cookies.get('notion_access_token')?.value;

  if (!token) {
    return new NextResponse('Notion not connected. Please connect Notion first.', { status: 400 });
  }

  const { data, error } = await supabase
    .from('connections')
    .insert({
      user_id: user.id,
      label: name,
      notion_database_id: databaseId,
      endpoint_slug: slug,
      notion_access_token: token,
    })
    .select()
    .single();

  if (error) {
    console.error('Create connection error:', error);
    if (error.code === '23505') {
      return new NextResponse('Endpoint slug already exists', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    name: data.label,
    databaseId: data.notion_database_id,
    slug: data.endpoint_slug,
    status: 'active',
    createdAt: new Date(data.created_at).toLocaleDateString(),
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
    .from('connections')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete connection error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  return NextResponse.json({ success: true });
}
