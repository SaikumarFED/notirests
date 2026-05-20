import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data, error } = await supabase
    .from('connections')
    .select('id, label, notion_database_id, endpoint_slug, is_active, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch connections error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  // Map to the format UI expects
  const formatted = data.map(d => ({
    id: d.id,
    name: d.label,
    databaseId: d.notion_database_id,
    slug: d.endpoint_slug,
    status: 'active',
    createdAt: new Date(d.created_at).toLocaleDateString(),
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

  const { data: workspace } = await supabase
    .from('notion_workspaces')
    .select('access_token')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (!workspace?.access_token) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Notion not connected',
        message: 'Please connect your Notion workspace first',
        action: 'connect_notion',
        connect_url: '/api/auth/notion'
      }),
      { status: 400 }
    );
  }

  const token = workspace.access_token;

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
