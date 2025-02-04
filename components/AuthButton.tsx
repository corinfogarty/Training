'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button, Dropdown } from 'react-bootstrap'
import { LogIn, LogOut, User, Settings } from 'lucide-react'
import Link from 'next/link'

interface AuthButtonProps {
  onAdminClick?: () => void
}

export default function AuthButton({ onAdminClick }: AuthButtonProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button variant="outline-light" disabled>
        <span className="spinner-border spinner-border-sm me-2" />
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <Dropdown align="end">
        <Dropdown.Toggle variant="outline-secondary" className="d-flex align-items-center gap-2">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || ''}
              className="rounded-circle"
              width={24}
              height={24}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <User size={16} />
          )}
          {session.user?.name || 'User'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {session.user?.isAdmin && (
            <>
              <Dropdown.Item onClick={onAdminClick}>
                Admin Dashboard
              </Dropdown.Item>
              <Dropdown.Divider />
            </>
          )}
          <Dropdown.Item onClick={() => signOut()}>
            <LogOut size={16} className="me-2" />
            Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  return (
    <Button 
      variant="outline-light" 
      onClick={() => signIn()}
    >
      <LogIn size={18} className="me-2" />
      Sign In
    </Button>
  )
} 