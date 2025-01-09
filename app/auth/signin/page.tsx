'use client'

import React, { useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Container, Button } from 'react-bootstrap'

// Debug logging helper that persists to localStorage
const logEvent = (event: string, data: any) => {
  const timestamp = new Date().toISOString()
  const logEntry = { timestamp, event, data }
  
  // Get existing logs
  const existingLogs = JSON.parse(localStorage.getItem('auth_logs') || '[]')
  
  // Add new log
  existingLogs.push(logEntry)
  
  // Save back to localStorage
  localStorage.setItem('auth_logs', JSON.stringify(existingLogs))
  
  // Also log to console
  console.log(`\n[${timestamp}] ${event}:`)
  console.log(JSON.stringify(data, null, 2))
  console.log('\n')
}

// Helper to display logs
const displayLogs = () => {
  const logs = JSON.parse(localStorage.getItem('auth_logs') || '[]')
  console.log('=== Auth Flow Logs ===')
  logs.forEach((log: any) => {
    console.log(`\n[${log.timestamp}] ${log.event}:`)
    console.log(JSON.stringify(log.data, null, 2))
  })
  console.log('\n=== End Logs ===')
}

export default function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const error = searchParams.get('error')

  // Log initial state and display existing logs
  useEffect(() => {
    logEvent('SignIn Page Mount', {
      callbackUrl,
      error,
      hostname: window.location.hostname,
      href: window.location.href,
      env: process.env.NODE_ENV
    })
    
    // Display all logs on mount
    displayLogs()
    
    // Clear logs if this is a fresh sign-in attempt (no error)
    if (!error) {
      localStorage.removeItem('auth_logs')
    }
  }, [callbackUrl, error])

  const handleSignIn = async () => {
    try {
      // If we're on training.ols.to, force that as the callback
      const finalCallback = window.location.hostname === 'training.ols.to' 
        ? 'https://training.ols.to'
        : callbackUrl || '/'

      logEvent('Initiating Sign In', {
        finalCallback,
        originalCallback: callbackUrl,
        hostname: window.location.hostname
      })
      
      await signIn('google', {
        callbackUrl: finalCallback,
        redirect: true,
      })
    } catch (error) {
      logEvent('Sign In Error', { error })
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
            <div className="mt-2">
              <small className="text-muted">
                Check the browser console for detailed logs.
              </small>
            </div>
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