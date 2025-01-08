'use client'

import { useSearchParams } from 'next/navigation'
import { Container } from 'react-bootstrap'

export default function Error() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
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
  )
} 