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

      // If we're in production, always redirect to training.ols.to
      if (process.env.NODE_ENV === 'production') {
        console.log('Production environment, redirecting to training.ols.to')
        return 'https://training.ols.to'
      }

      // In development, use the provided URL or baseUrl
      if (url.startsWith('/') || url.startsWith(baseUrl)) {
        return url
      }

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