import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * NANOBIO PRO RESEARCH TERMINAL MIDDLEWARE
 * Purpose: Session persistence and route protection for A-Z Nanoscience Curriculum.
 */
export async function middleware(request: NextRequest) {
  // Initialize response with current headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Initialize Supabase Server Client with Cookie persistence
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update request cookies for current execution
          request.cookies.set({ name, value, ...options })
          // Refresh response to ensure cookie is written back to browser
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Clear cookies in both request and response
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  /**
   * SESSION REFRESH PROTOCOL
   * Calling getUser() ensures the session is validated and refreshed in real-time.
   * This prevents the "constant logout" issue by syncing the session cookie.
   */
  const { data: { user } } = await supabase.auth.getUser()

  // Define Protected Matrix Paths
  const isProtectedPath = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/learn') ||
    request.nextUrl.pathname.startsWith('/quiz');

  // REDIRECT 1: Unauthorized access to Research Curriculum
  if (!user && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // REDIRECT 2: Authorized user trying to access Auth pages
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/learn', request.url))
  }

  return response
}

/**
 * Middleware Matcher Configuration
 * Excludes static assets and internal Next.js files to optimize performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}