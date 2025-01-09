import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import type { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"

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
      console.log('Sign in callback:', { 
        user, 
        account, 
        profile,
        env: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      })
      // Return true immediately to avoid message channel timeout
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { 
        url, 
        baseUrl,
        env: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      })

      // Always allow the base URL and its paths
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        console.log('Allowing base URL or path:', url)
        return url
      }

      // For absolute URLs, ensure they're from our domain
      try {
        const urlObj = new URL(url)
        if (urlObj.hostname === 'training.ols.to') {
          console.log('Allowing training.ols.to URL:', url)
          return url
        }
      } catch (e) {
        console.error('Error parsing URL:', e)
      }

      console.log('Defaulting to baseUrl:', baseUrl)
      return baseUrl
    },
    async jwt({ token, user, account, trigger }) {
      console.log('JWT callback:', { 
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
        } catch (e) {
          console.error('Error fetching user:', e)
          // Don't fail the auth flow if DB lookup fails
          token.isAdmin = false
        }
      }
      
      return token
    },
    async session({ session, token }) {
      console.log('Session callback:', { 
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