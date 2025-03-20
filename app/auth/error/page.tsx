'use client'

import { useSearchParams } from 'next/navigation'
import { Container } from 'react-bootstrap'
import Script from 'next/script'

export default function Error() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  return (
    <>
      {/* Google Analytics Script tags - added directly to the error page */}
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
      
      <Container className="py-5">
        <div className="text-center">
          <h1 className="h3 mb-4">Authentication Error</h1>
          <p className="text-danger">
            {error === 'AccessDenied' 
              ? 'You do not have permission to access this resource.'
              : 'An error occurred during authentication.'}
          </p>
        </div>
      </Container>
    </>
  )
} 