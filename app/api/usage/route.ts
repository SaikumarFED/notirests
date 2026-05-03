import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('api_usage')
    .select('*')
    .eq('user_id', user.id)
    .gte('timestamp', sevenDaysAgo.toISOString())
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Fetch usage error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  // Group by day for charts
  const chartData: Record<string, number> = {};
  
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    chartData[dateStr] = 0;
  }

  data.forEach(usage => {
    const d = new Date(usage.timestamp);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (chartData[dateStr] !== undefined) {
      chartData[dateStr]++;
    }
  });

  const formatted = Object.entries(chartData).map(([name, calls]) => ({
    name,
    calls
  }));

  return NextResponse.json(formatted);
}
