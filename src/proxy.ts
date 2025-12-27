// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. Rename the function from 'middleware' to 'proxy'
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define paths
  const isPublicPath = path === '/sign-in' || path === '/sign-up' || path === '/'
  
  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value || '' 

  // Redirect logic
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl))
  }

  if (isPublicPath && token && path === '/sign-in') {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  // Allow the request to continue
  return NextResponse.next()
}

// 2. The config export remains the same
export const config = {
  matcher: [
    '/', 
    '/sign-in', 
    '/dashboard/:path*', 
    '/api/users/:path*'
  ],
}