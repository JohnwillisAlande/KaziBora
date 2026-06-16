import { createBrowserClient } from '@supabase/ssr'

// This allows your Client Components (like buttons and forms) to talk to the database
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}