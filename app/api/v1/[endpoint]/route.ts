import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getNotionClient, cleanNotionPage, buildNotionProperties } from '@/lib/notion';
import { unauthorized, notFound, rateLimited, serverError, notionDisconnected } from '@/lib/api-errors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  if (!apiKey) return { error: unauthorized('Missing x-api-key header'), headers: {} };

  const supabase = getAdminClient();

  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('user_id, is_active')
    .eq('key', apiKey)
    .single();

  if (keyError || !keyData || !keyData.is_active) {
    return { error: unauthorized('Invalid or inactive API key'), headers: {} };
  }

  const userId = keyData.user_id;

  await supabase.from('api_keys').update({ last_used: new Date().toISOString() }).eq('key', apiKey);

  const { data: connection, error: connError } = await supabase
    .from('connections')
    .select('notion_database_id, notion_access_token')
    .eq('endpoint_slug', endpointSlug)
    .eq('user_id', userId)
    .single();

  if (connError || !connection) {
    return { error: notFound('Endpoint not found or does not belong to you'), headers: {} };
  }

  // Fallback token lookup in notion_workspaces
  let token = connection.notion_access_token;
  if (!token) {
    const { data: workspace } = await supabase
      .from('notion_workspaces')
      .select('access_token')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    if (workspace?.access_token) {
      token = workspace.access_token;
    }
  }

  if (!token) {
    return { error: notionDisconnected(), headers: {} };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, api_calls_this_month')
    .eq('id', userId)
    .single();

  const plan = profile?.plan || 'free';
  const calls = profile?.api_calls_this_month || 0;
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS['free'];
  const remaining = Math.max(0, limit - calls);

  const rateLimitHeaders = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': 'Monthly',
    'X-RateLimit-Plan': plan,
  };

  if (calls >= limit) {
    return { error: rateLimited(plan), headers: rateLimitHeaders };
  }

  return { userId, connection: { ...connection, notion_access_token: token }, supabase, headers: rateLimitHeaders };
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
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');
  
  // Filtering and sorting
  const filterParams = searchParams.getAll('filter');
  const sortParams = searchParams.getAll('sort');
  
  let filter: any = undefined;
  let sorts: any[] = [];

  if (filterParams.length > 0) {
    // For simplicity, we implement a single AND filter list
    const andFilters: any[] = [];
    for (const f of filterParams) {
      const parts = f.split(':');
      if (parts.length >= 2) {
        const propName = parts[0];
        const value = parts.slice(1).join(':'); // Re-join in case value contains colons
        // We do a naive text search or exact match depending on Notion capabilities.
        // A generic rich_text contains filter is most robust for strings.
        andFilters.push({
          property: propName,
          rich_text: { contains: value }
        });
      }
    }
    if (andFilters.length > 0) {
      filter = { and: andFilters };
    }
  }

  if (sortParams.length > 0) {
    for (const s of sortParams) {
      const parts = s.split(':');
      if (parts.length >= 2) {
        const propName = parts[0];
        const dir = parts[1].toLowerCase() === 'desc' ? 'descending' : 'ascending';
        if (propName === 'created_time' || propName === 'last_edited_time') {
          sorts.push({ timestamp: propName, direction: dir });
        } else {
          sorts.push({ property: propName, direction: dir });
        }
      }
    }
  }

  try {
    const notion = getNotionClient(auth.connection!.notion_access_token);
    
    const queryArgs: any = {
      database_id: auth.connection!.notion_database_id,
      page_size: limit,
    };

    if (filter) queryArgs.filter = filter;
    if (sorts.length > 0) queryArgs.sorts = sorts;

    const response = await notion.databases.query(queryArgs);

    const results = response.results.map(cleanNotionPage);
    await logUsage(auth.supabase, auth.userId!, endpoint, 'GET', 200);

    return NextResponse.json({ data: results, has_more: response.has_more }, { headers: auth.headers });
  } catch (error: any) {
    await logUsage(auth.supabase, auth.userId!, endpoint, 'GET', 500);
    if (error.status === 401) return notionDisconnected();
    return serverError(error.message);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;
  const auth = await authenticateAndLog(request, endpoint, 'POST');
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const notion = getNotionClient(auth.connection!.notion_access_token);
    
    // buildNotionProperties will auto-convert simple JSON to complex Notion objects
    const notionProps = await buildNotionProperties(notion, auth.connection!.notion_database_id, body);
    
    const response = await notion.pages.create({
      parent: { database_id: auth.connection!.notion_database_id },
      properties: notionProps,
    });

    await logUsage(auth.supabase, auth.userId!, endpoint, 'POST', 201);
    return NextResponse.json(cleanNotionPage(response), { status: 201, headers: auth.headers });
  } catch (error: any) {
    await logUsage(auth.supabase, auth.userId!, endpoint, 'POST', 500);
    if (error.status === 401) return notionDisconnected();
    return serverError(error.message);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;
  const auth = await authenticateAndLog(request, endpoint, 'PATCH');
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('id');
  if (!pageId) {
    return NextResponse.json({ error: 'Missing page ?id parameter' }, { status: 400, headers: auth.headers });
  }

  try {
    const body = await request.json();
    const notion = getNotionClient(auth.connection!.notion_access_token);
    
    const notionProps = await buildNotionProperties(notion, auth.connection!.notion_database_id, body);
    
    const response = await notion.pages.update({
      page_id: pageId,
      properties: notionProps,
    });

    await logUsage(auth.supabase, auth.userId!, endpoint, 'PATCH', 200);
    return NextResponse.json(cleanNotionPage(response), { headers: auth.headers });
  } catch (error: any) {
    await logUsage(auth.supabase, auth.userId!, endpoint, 'PATCH', 500);
    if (error.status === 401) return notionDisconnected();
    return serverError(error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;
  const auth = await authenticateAndLog(request, endpoint, 'DELETE');
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('id');
  if (!pageId) {
    return NextResponse.json({ error: 'Missing page ?id parameter' }, { status: 400, headers: auth.headers });
  }

  try {
    const notion = getNotionClient(auth.connection!.notion_access_token);
    
    const response = await notion.pages.update({
      page_id: pageId,
      archived: true,
    });

    await logUsage(auth.supabase, auth.userId!, endpoint, 'DELETE', 200);
    return NextResponse.json({ success: true, id: response.id }, { headers: auth.headers });
  } catch (error: any) {
    await logUsage(auth.supabase, auth.userId!, endpoint, 'DELETE', 500);
    if (error.status === 401) return notionDisconnected();
    return serverError(error.message);
  }
}
