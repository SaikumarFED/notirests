import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getNotionClient, cleanNotionPage } from '@/lib/notion';

// Create a service role client to bypass RLS for API key verification
// We can't use the standard server client because the request isn't authenticated via cookies
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, supabaseAdminKey);
}

const PLAN_LIMITS: Record<string, number> = {
  free: 1000,
  pro: 50000,
  agency: 500000,
};

async function authenticateAndLog(request: NextRequest, endpointSlug: string, method: string) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return { error: 'Missing x-api-key header', status: 401 };

  const supabase = getAdminClient();

  // 1. Verify API Key
  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('user_id, is_active')
    .eq('key', apiKey)
    .single();

  if (keyError || !keyData || !keyData.is_active) {
    return { error: 'Invalid or inactive API key', status: 401 };
  }

  const userId = keyData.user_id;

  // 2. Update last_used
  await supabase.from('api_keys').update({ last_used: new Date().toISOString() }).eq('key', apiKey);

  // 3. Verify Connection
  const { data: connection, error: connError } = await supabase
    .from('connections')
    .select('notion_database_id, notion_access_token')
    .eq('endpoint_slug', endpointSlug)
    .eq('user_id', userId)
    .single();

  if (connError || !connection) {
    return { error: 'Endpoint not found or does not belong to you', status: 404 };
  }

  // 4. Check Rate Limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, api_calls_this_month')
    .eq('id', userId)
    .single();

  const plan = profile?.plan || 'free';
  const calls = profile?.api_calls_this_month || 0;
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS['free'];

  if (calls >= limit) {
    return { error: `Monthly API limit reached for plan: ${plan}`, status: 429 };
  }

  return { userId, connection, supabase };
}

async function logUsage(supabase: any, userId: string, endpointSlug: string, method: string, statusCode: number) {
  await supabase.from('api_usage').insert({
    user_id: userId,
    endpoint_slug: endpointSlug,
    method,
    status_code: statusCode
  });

  await supabase.rpc('increment_api_calls', { user_id_param: userId });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;
  const auth = await authenticateAndLog(request, endpoint, 'GET');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    const notion = getNotionClient(auth.connection.notion_access_token);
    
    // We can support filters/sorts from query params in a real production app.
    // For now, basic query.
    const response = await notion.databases.query({
      database_id: auth.connection.notion_database_id,
      page_size: limit,
    });

    const results = response.results.map(cleanNotionPage);
    await logUsage(auth.supabase, auth.userId, endpoint, 'GET', 200);

    return NextResponse.json({ data: results, has_more: response.has_more });
  } catch (error: any) {
    await logUsage(auth.supabase, auth.userId, endpoint, 'GET', 500);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;
  const auth = await authenticateAndLog(request, endpoint, 'POST');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const notion = getNotionClient(auth.connection.notion_access_token);
    
    const response = await notion.pages.create({
      parent: { database_id: auth.connection.notion_database_id },
      properties: body, // Caller must format properties correctly for Notion API
    });

    await logUsage(auth.supabase, auth.userId, endpoint, 'POST', 201);
    return NextResponse.json(cleanNotionPage(response), { status: 201 });
  } catch (error: any) {
    await logUsage(auth.supabase, auth.userId, endpoint, 'POST', 500);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;
  const auth = await authenticateAndLog(request, endpoint, 'PATCH');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('id');
  if (!pageId) return NextResponse.json({ error: 'Missing page ?id parameter' }, { status: 400 });

  try {
    const body = await request.json();
    const notion = getNotionClient(auth.connection.notion_access_token);
    
    const response = await notion.pages.update({
      page_id: pageId,
      properties: body,
    });

    await logUsage(auth.supabase, auth.userId, endpoint, 'PATCH', 200);
    return NextResponse.json(cleanNotionPage(response));
  } catch (error: any) {
    await logUsage(auth.supabase, auth.userId, endpoint, 'PATCH', 500);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;
  const auth = await authenticateAndLog(request, endpoint, 'DELETE');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('id');
  if (!pageId) return NextResponse.json({ error: 'Missing page ?id parameter' }, { status: 400 });

  try {
    const notion = getNotionClient(auth.connection.notion_access_token);
    
    // Archive the page
    const response = await notion.pages.update({
      page_id: pageId,
      archived: true,
    });

    await logUsage(auth.supabase, auth.userId, endpoint, 'DELETE', 200);
    return NextResponse.json({ success: true, id: response.id });
  } catch (error: any) {
    await logUsage(auth.supabase, auth.userId, endpoint, 'DELETE', 500);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
