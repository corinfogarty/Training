'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Container, Button } from 'react-bootstrap'

export default function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const error = searchParams.get('error')

  const handleSignIn = async () => {
    try {
      // If we're on training.ols.to, force that as the callback
      const finalCallback = window.location.hostname === 'training.ols.to' 
        ? 'https://training.ols.to'
        : callbackUrl || '/'

      console.log('Signing in with callback:', finalCallback)
      
      await signIn('google', {
        callbackUrl: finalCallback,
        redirect: true,
      })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

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
          onClick={handleSignIn}
        >
          Sign in with Google
        </Button>
      </div>
    </Container>
  )
} 