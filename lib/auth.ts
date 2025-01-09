import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import type { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"

// Debug logging helper
const logEvent = (event: string, data: any) => {
  console.log(`\n[${new Date().toISOString()}] ${event}:`)
  console.log(JSON.stringify(data, null, 2))
  console.log('\n')
}

// Get the base URL based on environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXTAUTH_URL || 'https://training.ols.to'
  }
  // Try port 3001 if 3000 is in use
  const port = process.env.PORT || '3001'
  return process.env.NEXTAUTH_URL || `http://localhost:${port}`
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      logEvent('signIn callback', { 
        user, 
        account, 
        profile,
        env: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NODE_ENV: process.env.NODE_ENV,
          baseUrl: getBaseUrl()
        }
      })
      return true
    },
    async redirect({ url, baseUrl }) {
      const envBaseUrl = getBaseUrl()
      logEvent('redirect callback', { 
        url, 
        baseUrl,
        envBaseUrl,
        env: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      })

      // Allow OAuth callbacks to complete
      if (url.includes('/api/auth/callback')) {
        logEvent('allowing callback', { url })
        return url
      }

      // For all other URLs in production, redirect to home
      if (process.env.NODE_ENV === 'production') {
        const redirectUrl = envBaseUrl
        logEvent('production redirect', { redirectUrl })
        return redirectUrl
      }

      // In development, use the provided URL or baseUrl
      if (url.startsWith('/')) {
        logEvent('development redirect', { url: `${envBaseUrl}${url}` })
        return `${envBaseUrl}${url}`
      }

      if (url.startsWith(baseUrl)) {
        logEvent('development redirect', { url })
        return url
      }

      logEvent('fallback redirect', { baseUrl: envBaseUrl })
      return envBaseUrl
    },
    async jwt({ token, user, account, trigger }) {
      logEvent('jwt callback', { 
        token, 
        user, 
        trigger, 
        account,
        env: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NODE_ENV: process.env.NODE_ENV,
          baseUrl: getBaseUrl()
        }
      })
      
      // Always check admin status on token refresh
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! }
        })
        token.isAdmin = dbUser?.isAdmin || false
        token.userId = dbUser?.id
        logEvent('user lookup success', { dbUser })
      } catch (e) {
        logEvent('user lookup error', { error: e })
        token.isAdmin = false
      }
      
      return token
    },
    async session({ session, token }) {
      logEvent('session callback', { 
        session, 
        token,
        env: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NODE_ENV: process.env.NODE_ENV,
          baseUrl: getBaseUrl()
        }
      })
      
      if (session?.user) {
        session.user.isAdmin = token.isAdmin as boolean
        session.user.id = token.userId as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
} 