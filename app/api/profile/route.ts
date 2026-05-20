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
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Fetch profile error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { full_name, company_name } = body;

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, company_name })
    .eq('id', user.id);

  if (error) {
    console.error('Update profile error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  return NextResponse.json({ success: true });
}
