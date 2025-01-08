'use client'

import { Container, Nav } from 'react-bootstrap'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Users, Grid, Settings } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="d-flex">
      <div className="bg-dark text-white" style={{ width: '240px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="mb-4">Admin Panel</h5>
          <Nav className="flex-column">
            <Link 
              href="/admin/users" 
              className={`nav-link ${pathname === '/admin/users' ? 'active' : ''}`}
            >
              <Users size={16} className="me-2" />
              Users
            </Link>
            <Link 
              href="/admin/categories" 
              className={`nav-link ${pathname === '/admin/categories' ? 'active' : ''}`}
            >
              <Grid size={16} className="me-2" />
              Categories
            </Link>
            <Link 
              href="/admin/settings" 
              className={`nav-link ${pathname === '/admin/settings' ? 'active' : ''}`}
            >
              <Settings size={16} className="me-2" />
              Settings
            </Link>
          </Nav>
        </div>
      </div>
      <div className="flex-grow-1 bg-light">
        <Container className="py-4">
          {children}
        </Container>
      </div>
    </div>
  )
} 