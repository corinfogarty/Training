import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import NextAuth from "next-auth"
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
          prompt: "select_account"
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log('Sign in callback:', { user, account })
      
      // Update user's lastLogin and ensure image is saved
      await prisma.user.update({
        where: { email: user.email! },
        data: {
          lastLogin: new Date(),
          image: user.image || undefined
        }
      })
      
      return true
    },
    async jwt({ token, user, account, trigger }) {
      console.log('JWT callback:', { token, user, trigger })
      
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
      console.log('Session callback:', { session, token })
      
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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 