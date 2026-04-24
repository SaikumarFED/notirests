import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url));
  }

  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  const redirectUri = process.env.NOTION_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: 'Missing Notion credentials' }, { status: 500 });
  }

  try {
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // Exchange code for access token
    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${encoded}`,
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Notion OAuth error:', data);
      return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
    }

    // data contains: access_token, workspace_id, workspace_name, etc.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Save or update workspace in DB
    const { error: dbError } = await supabase
      .from('notion_workspaces')
      .upsert({
        user_id: user.id,
        access_token: data.access_token,
        workspace_id: data.workspace_id,
        workspace_name: data.workspace_name,
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (dbError) {
      console.error('Database error saving workspace:', dbError);
    }

    return NextResponse.redirect(new URL('/dashboard/settings?setup=complete', request.url));
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=server_error', request.url));
  }
}
