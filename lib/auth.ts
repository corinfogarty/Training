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

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  debug: true,
  logger: {
    error(code, ...message) {
      logEvent(`Error: ${code}`, message)
    },
    warn(code, ...message) {
      logEvent(`Warning: ${code}`, message)
    },
    debug(code, ...message) {
      logEvent(`Debug: ${code}`, message)
    }
  },
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
          NODE_ENV: process.env.NODE_ENV
        }
      })
      return true
    },
    async redirect({ url, baseUrl }) {
      logEvent('redirect callback', { 
        url, 
        baseUrl,
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
        const redirectUrl = 'https://training.ols.to'
        logEvent('production redirect', { redirectUrl })
        return redirectUrl
      }

      // In development, use the provided URL or baseUrl
      if (url.startsWith('/') || url.startsWith(baseUrl)) {
        logEvent('development redirect', { url })
        return url
      }

      logEvent('fallback redirect', { baseUrl })
      return baseUrl
    },
    async jwt({ token, user, account, trigger }) {
      logEvent('jwt callback', { 
        token, 
        user, 
        trigger, 
        account,
        env: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      })
      
      if (trigger === 'signIn' || trigger === 'signUp') {
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
      }
      
      return token
    },
    async session({ session, token }) {
      logEvent('session callback', { 
        session, 
        token,
        env: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NODE_ENV: process.env.NODE_ENV
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