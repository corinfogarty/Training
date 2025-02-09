'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Grid, Settings, GraduationCap } from 'lucide-react'

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-md">
      <nav className="p-4 space-y-2">
        <Link
          href="/admin/users"
          className={`flex items-center space-x-2 p-2 rounded-md ${
            pathname === '/admin/users'
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users</span>
        </Link>
        <Link
          href="/admin/categories"
          className={`flex items-center space-x-2 p-2 rounded-md ${
            pathname === '/admin/categories'
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Categories</span>
        </Link>
        <Link
          href="/admin/pathways"
          className={`flex items-center space-x-2 p-2 rounded-md ${
            pathname === '/admin/pathways'
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Pathways</span>
        </Link>
        <Link
          href="/admin/settings"
          className={`flex items-center space-x-2 p-2 rounded-md ${
            pathname === '/admin/settings'
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  )
} 