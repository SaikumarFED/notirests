import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/dashboard?error=missing_code', request.url)
    );
  }

  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  const redirectUri = process.env.NOTION_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing Notion environment variables');

    return NextResponse.redirect(
      new URL('/dashboard?error=missing_env', request.url)
    );
  }

  try {
    console.log('Starting Notion OAuth token exchange');

    const tokenResponse = await fetch(
      'https://api.notion.com/v1/oauth/token',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString('base64')}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();

      console.error('========== NOTION TOKEN ERROR ==========');
      console.error(errText);
      console.error('=======================================');

      return NextResponse.json(
        {
          error: 'token_failed',
          details: errText,
        },
        { status: 500 }
      );
    }

    const data = await tokenResponse.json();

    console.log('Notion token exchange successful');

    const accessToken = data.access_token;
    const workspaceId = data.workspace_id;
    const workspaceName = data.workspace_name;
    const workspaceIcon = data.workspace_icon || null;
    const botId = data.bot_id || null;

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Supabase user error:', userError);

      return NextResponse.redirect(
        new URL('/dashboard?error=user_fetch_failed', request.url)
      );
    }

    if (!user) {
      console.error('No authenticated user found');

      return NextResponse.redirect(
        new URL('/dashboard?error=no_user_session', request.url)
      );
    }

    console.log('Authenticated user:', user.id);

    const { error: upsertError } = await supabaseAdmin
      .from('notion_workspaces')
      .upsert(
        {
          user_id: user.id,
          access_token: accessToken,
          workspace_id: workspaceId,
          workspace_name: workspaceName,
          workspace_icon: workspaceIcon,
          bot_id: botId,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,workspace_id',
        }
      );

    if (upsertError) {
      console.error('Database upsert error:', upsertError);

      return NextResponse.redirect(
        new URL('/dashboard?error=db_insert_failed', request.url)
      );
    }

    console.log('Notion workspace saved successfully');

    return NextResponse.redirect(
      new URL('/dashboard/endpoints?notion=connected', request.url)
    );
  } catch (error) {
    console.error('========== NOTION CALLBACK ERROR ==========');
    console.error(error);
    console.error('===========================================');

    return NextResponse.redirect(
      new URL('/dashboard?error=server_error', request.url)
    );
  }
}
