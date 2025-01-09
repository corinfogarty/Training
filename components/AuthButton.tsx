'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button, Dropdown } from 'react-bootstrap'
import { LogIn, LogOut, User, Settings } from 'lucide-react'
import Link from 'next/link'

export default function AuthButton() {
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
        <Dropdown.Toggle variant="outline-light" id="user-menu">
          <User size={18} className="me-2" />
          {session.user?.name || session.user?.email}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {session.user?.isAdmin && (
            <Link href="/admin/users" className="dropdown-item">
              <Settings size={16} className="me-2" />
              Admin Panel
            </Link>
          )}
          {session.user?.isAdmin && <Dropdown.Divider />}
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