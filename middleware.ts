import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Export middleware with simpler auth check
export default withAuth(
  function middleware(req) {
    console.log('Middleware token:', req.nextauth.token)
    
    const isAdmin = req.nextauth.token?.isAdmin
    const path = req.nextUrl.pathname

    if (path.startsWith('/admin')) {
      if (!isAdmin) {
        console.log('Access denied:', { isAdmin, path })
        return NextResponse.redirect(new URL('/', req.url))
      }
      console.log('Access granted:', { isAdmin, path })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Authorization check:', { token })
        return !!token
      }
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
} 