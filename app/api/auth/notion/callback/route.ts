import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

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
    const workspaceIcon = data.workspace_icon || null;
    const botId = data.bot_id || null;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabaseAdmin
        .from('notion_workspaces')
        .upsert({
          user_id: user.id,
          access_token: accessToken,
          workspace_id: workspaceId,
          workspace_name: workspaceName,
          workspace_icon: workspaceIcon,
          bot_id: botId,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id,workspace_id' 
        });
    }

    // Remove any old cookie if it exists to clean up
    const response = NextResponse.redirect(new URL('/dashboard/endpoints?notion=connected', request.url));
    response.cookies.delete('notion_access_token');

    return response;

  } catch (error) {
    console.error('Notion auth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=server_error', request.url));
  }
}
