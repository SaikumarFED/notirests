import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

export const supabase = createBrowserClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Helper function to get current user
export async function getCurrentUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to get current user profile
export async function getCurrentUserProfile() {
  const user = await getCurrentUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

// Helper function to create/update profile
export async function upsertUserProfile(
  userId: string,
  profile: {
    email: string
    full_name?: string
    avatar_url?: string
    company_name?: string
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        company_name: profile.company_name,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error upserting user profile:', error)
    return null
  }

  return data
}

// Sign Up
export async function signUp(
  email: string,
  password: string,
  fullName?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
    },
  })

  if (error) throw error

  if (data.user) {
    await upsertUserProfile(data.user.id, {
      email,
      full_name: fullName,
    })
  }

  return data
}

// Sign In
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  return data
}

// Sign Out
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}

// OAuth Login
export async function signInWithOAuth(
  provider: 'google' | 'github'
) {
  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined

  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

  if (error) throw error

  return data
}