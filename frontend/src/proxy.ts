import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const { pathname } = req.nextUrl

  // Protect dashboard routes
   const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
  
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // Redirect authenticated users from home to dashboard
  if (userId && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
},{
  authorizedParties:['http://10.5.146.66:3000', 'http://localhost:3000'],
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
}