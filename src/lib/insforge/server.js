import { cookies } from 'next/headers'
import { createServerClient } from '@insforge/sdk/ssr'
import { createAdminClient } from '@insforge/sdk'

export async function createInsForgeServerClient() {
  return createServerClient({
    cookies: await cookies()
  })
}

export function createInsForgeAdminClient() {
  return createAdminClient({
    baseUrl: process.env.INSFORGE_URL,
    apiKey: process.env.INSFORGE_API_KEY
  })
}
