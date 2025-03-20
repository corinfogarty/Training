import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import 'bootstrap/dist/css/bootstrap.min.css'
import { LoginUpdater } from "@/components/auth/LoginUpdater"
import { Toaster } from "@/components/ui/toaster"
import { PathwayProvider } from '@/components/PathwayContext'
// import GoogleAnalytics from '@/components/GoogleAnalytics'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Training Hub',
  description: 'A hub for all your training resources',
  icons: {
    icon: '/favicon.png',
    apple: '/logo-ols-2023.png',
  },
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

        {/* Google Analytics - Direct Implementation */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-RPHM2B4SNB`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RPHM2B4SNB');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* <GoogleAnalytics /> */}
        <Providers session={session}>
          <PathwayProvider>
            <LoginUpdater />
            {children}
            <Toaster />
          </PathwayProvider>
        </Providers>
      </body>
    </html>
  )
}
