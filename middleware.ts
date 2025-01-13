import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: -1,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Debug logging
  console.log('Auth state:', {
    path: request.nextUrl.pathname,
    isAuthenticated: !!user,
    userId: user?.id
  })

  // Allow access to the root path and other public paths without authentication
  const isPublicPath = request.nextUrl.pathname === '/' || 
                      request.nextUrl.pathname.match(/^\/sign-in|^\/sign-up|^\/auth/)

  // If user is not signed in and trying to access a protected path,
  // redirect the user to /sign-in
  if (!user && !isPublicPath) {
    console.log('Redirecting unauthenticated user to /sign-in')
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // If user is signed in and trying to access auth pages,
  // redirect them to the dashboard
  if (user && request.nextUrl.pathname.match(/^\/sign-in|^\/sign-up/)) {
    console.log('Redirecting authenticated user to /protected')
    return NextResponse.redirect(new URL('/protected', request.url))
  }

  // Update session if user exists
  if (user) {
    await supabase.auth.getSession()
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
