'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Container, Button } from 'react-bootstrap'

export default function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  return (
    <Container className="py-5">
      <div className="text-center">
        <h1 className="h3 mb-4">Sign In</h1>
        <Button 
          variant="primary"
          onClick={() => signIn('google', { callbackUrl })}
        >
          Sign in with Google
        </Button>
      </div>
    </Container>
  )
} 