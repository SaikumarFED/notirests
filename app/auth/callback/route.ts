import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=no_code`
    )
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth exchange error:', error)

    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=oauth_failed`
    )
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/dashboard`
  )
}
