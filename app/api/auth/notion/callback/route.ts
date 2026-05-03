import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=missing_code', request.url));
  }

  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  const redirectUri = process.env.NOTION_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL('/dashboard?error=missing_env', request.url));
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error('Notion token error:', errText);
      return NextResponse.redirect(new URL('/dashboard?error=token_failed', request.url));
    }

    const data = await tokenResponse.json();
    const accessToken = data.access_token;
    const workspaceId = data.workspace_id;
    const workspaceName = data.workspace_name;

    // We don't save the connection here because Notion OAuth grants access to the workspace.
    // The user still needs to pick a specific database to connect to. 
    // We will redirect them back to the dashboard with the token so they can create an endpoint.
    // However, to keep it secure, we should store it temporarily or just pass it to the frontend via a secure mechanism or store it in a session.
    // Actually, the prompt says: "stores token in Supabase connections table". 
    // But we don't have the database ID yet. The user selects pages during the Notion OAuth.
    // The token response includes `duplicated_template_id` if they duplicated a template, but usually, we just store the access_token.
    // Let's store a generic "workspace" connection, or just pass it back.
    // The prompt says: POST /api/connections creates new connection with notion_database_id, slug, label, notion_access_token.
    // So the OAuth callback should probably just pass the access token back securely, OR store it temporarily.
    // Since this is a simple implementation, let's redirect with the token in a hash or query param (not ideal for prod but common for simple SaaS), or store it in a cookie.
    
    const response = NextResponse.redirect(new URL('/dashboard/endpoints?success=true', request.url));
    response.cookies.set('notion_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;

  } catch (error) {
    console.error('Notion auth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=server_error', request.url));
  }
}
