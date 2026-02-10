import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()

  const { userId, isAuthenticated } = await auth()
  const { pathname } = req.nextUrl

  // Redirect only from landing/auth pages (example: home)
  if (userId && isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}, {
  authorizedParties: ['http://localhost:3000', 'http://10.5.146.66:3000'],
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
}
