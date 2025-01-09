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

      // List of allowed callback URLs from Google OAuth config
      const allowedCallbacks = [
        'http://localhost:3000/api/auth/callback/google',
        'http://localhost:3000/api/auth/callback',
        'https://training.ols.to/api/auth/callback/google',
        'https://training.ols.to/api/auth/callback',
        'https://training.ols.to'
      ]

      // Check if URL matches any allowed callback
      if (allowedCallbacks.some(callback => url.startsWith(callback))) {
        console.log('Allowing configured callback URL:', url)
        return url
      }

      // Allow relative URLs
      if (url.startsWith("/")) {
        const finalUrl = `${baseUrl}${url}`
        console.log('Allowing relative URL:', finalUrl)
        return finalUrl
      }

      // Allow URLs from same origin
      try {
        const urlOrigin = new URL(url).origin
        const baseOrigin = new URL(baseUrl).origin
        if (urlOrigin === baseOrigin) {
          console.log('Allowing same origin URL:', url)
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
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! }
        })
        token.isAdmin = dbUser?.isAdmin || false
        token.userId = dbUser?.id
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