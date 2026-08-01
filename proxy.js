import { NextResponse } from 'next/server'
import { updateSession } from '@insforge/sdk/ssr/middleware'

export async function proxy(request) {
  const response = NextResponse.next({ request })

  await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies
  })

  // Redirect unauthenticated users to login (except for login page and API routes)
  const { pathname } = request.nextUrl
  if (
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/_next/') &&
    !pathname.startsWith('/favicon')
  ) {
    const accessToken = request.cookies.get('insforge_access_token')?.value
    if (!accessToken) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}
