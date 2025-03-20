'use client'

import { signIn } from 'next-auth/react'
import { Button } from 'react-bootstrap'
import { useEffect } from 'react'
import Script from 'next/script'

export default function SignInComponent({ providers }: { providers: any }) {
  const handleSignIn = async () => {
    try {
      // If we're on training.ols.to, force that as the callback
      const finalCallback = window.location.hostname === 'training.ols.to' 
        ? 'https://training.ols.to'
        : window.location.origin

      await signIn('google', {
        callbackUrl: finalCallback,
        redirect: true,
      })
    } catch (error) {
      console.error('Sign In Error:', error)
    }
  }

  return (
    <>
      {/* Google Analytics Script tags - added directly to the signin page */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-RPHM2B4SNB`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RPHM2B4SNB', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      
      <div className="text-center">
        <Button 
          variant="primary" 
          size="lg"
          className="w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleSignIn}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 488 512">
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
          </svg>
          Sign in with Google
        </Button>
        <p className="text-muted mt-3 small">Only @ols.design email addresses are allowed.</p>
      </div>
    </>
  )
} 