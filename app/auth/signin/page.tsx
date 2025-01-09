'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Container, Button } from 'react-bootstrap'

export default function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const error = searchParams.get('error')

  return (
    <Container className="py-5">
      <div className="text-center">
        <h1 className="h3 mb-4">Sign In</h1>
        {error && (
          <div className="alert alert-danger mb-4">
            {error === 'OAuthCallback' ? 
              'There was a problem with the Google sign-in. Please try again.' :
              'An error occurred during sign in.'}
          </div>
        )}
        <Button 
          variant="primary"
          onClick={() => signIn('google', { 
            callbackUrl,
            redirect: true
          })}
        >
          Sign in with Google
        </Button>
      </div>
    </Container>
  )
} 