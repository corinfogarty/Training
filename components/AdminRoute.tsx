'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Alert } from 'react-bootstrap'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <Alert variant="danger" className="m-4">
        <Alert.Heading>Access Denied</Alert.Heading>
        <p>You need administrator privileges to access this page.</p>
      </Alert>
    )
  }

  return <>{children}</>
} 