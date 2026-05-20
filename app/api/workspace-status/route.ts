import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ connected: false });
  }

  const { data: workspace, error } = await supabase
    .from('notion_workspaces')
    .select('workspace_name, access_token')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !workspace || !workspace.access_token) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({ 
    connected: true, 
    workspace_name: workspace.workspace_name 
  });
}
