// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // If the route is protected and user is not signed in → block
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // otherwise allow
  return NextResponse.next()
})
