'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  return (
    <nav className="navbar">
      {/* ... existing navbar content ... */}
      
      {isAdmin && (
        <Link 
          href="/admin/categories" 
          className="btn btn-outline-light d-flex align-items-center"
        >
          <Settings size={16} className="me-2" />
          Admin Panel
        </Link>
      )}
      
      {/* ... rest of navbar ... */}
    </nav>
  )
} 