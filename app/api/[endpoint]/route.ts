import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import crypto from 'crypto';
import { Client } from '@notionhq/client';

async function validateRequest(request: Request, slug: string) {
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey) {
    return { error: 'Missing x-api-key header', status: 401 };
  }

  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const adminDb = createAdminClient();

  // 1. Validate API Key
  const { data: keyData, error: keyError } = await adminDb
    .from('api_keys')
    .select('user_id, status')
    .eq('key_hash', keyHash)
    .single();

  if (keyError || !keyData || keyData.status !== 'active') {
    return { error: 'Invalid or revoked API key', status: 401 };
  }

  // Update last_used
  await adminDb
    .from('api_keys')
    .update({ last_used: new Date().toISOString() })
    .eq('key_hash', keyHash);

  // 2. Validate Endpoint exists for this user
  const { data: connectionData, error: connError } = await adminDb
    .from('connections')
    .select('database_id')
    .eq('slug', slug)
    .eq('user_id', keyData.user_id)
    .eq('status', 'active')
    .single();

  if (connError || !connectionData) {
    return { error: 'Endpoint not found or inactive', status: 404 };
  }

  // 3. Get Notion Workspace integration token
  const { data: workspaceData, error: workspaceError } = await adminDb
    .from('notion_workspaces')
    .select('access_token')
    .eq('user_id', keyData.user_id)
    .single();

  if (workspaceError || !workspaceData) {
    return { error: 'Notion integration not found for this user', status: 403 };
  }

  return {
    databaseId: connectionData.database_id,
    accessToken: workspaceData.access_token,
  };
}

// GET /api/[endpoint] -> Query Notion Database
export async function GET(
  request: Request,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const slug = (await params).endpoint;
  const validation = await validateRequest(request, slug);

  if ('error' in validation) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const { databaseId, accessToken } = validation;
  const notion = new Client({ auth: accessToken });

  try {
    // Basic query, could map URL search params to Notion filters
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}

// POST /api/[endpoint] -> Create a Page in Notion Database
export async function POST(
  request: Request,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const slug = (await params).endpoint;
  const validation = await validateRequest(request, slug);

  if ('error' in validation) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const { databaseId, accessToken } = validation;
  const notion = new Client({ auth: accessToken });

  try {
    const body = await request.json();
    
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: body.properties || body,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}

// PATCH /api/[endpoint] -> Update a Page
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const slug = (await params).endpoint;
  const validation = await validateRequest(request, slug);

  if ('error' in validation) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const { accessToken } = validation;
  const notion = new Client({ auth: accessToken });

  try {
    const { page_id, properties } = await request.json();

    if (!page_id || !properties) {
      return NextResponse.json({ error: 'Missing page_id or properties' }, { status: 400 });
    }
    
    const response = await notion.pages.update({
      page_id: page_id,
      properties: properties,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}

// DELETE is not natively a "delete" in Notion API for pages, usually it's "archive" using update.
// We'll map DELETE to archiving a page.
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const slug = (await params).endpoint;
  const validation = await validateRequest(request, slug);

  if ('error' in validation) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const { accessToken } = validation;
  const notion = new Client({ auth: accessToken });

  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('page_id');

    if (!pageId) {
      return NextResponse.json({ error: 'Missing page_id query param' }, { status: 400 });
    }
    
    const response = await notion.pages.update({
      page_id: pageId,
      archived: true,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
