'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { LogIn } from 'lucide-react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>Please sign in to access this page</Alert.Heading>
        <p>You need to be authenticated to view and manage resources.</p>
        <Button 
          variant="primary" 
          onClick={() => signIn()}
          className="mt-3"
        >
          <LogIn size={18} className="me-2" />
          Sign In
        </Button>
      </Alert>
    )
  }

  return <>{children}</>
} 