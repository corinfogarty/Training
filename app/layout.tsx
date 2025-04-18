import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import 'bootstrap/dist/css/bootstrap.min.css'
import { LoginUpdater } from "@/components/auth/LoginUpdater"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Training Hub',
  description: 'A hub for all your training resources',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <Providers session={session}>
          <LoginUpdater />
          {children}
        </Providers>
      </body>
    </html>
  )
}
