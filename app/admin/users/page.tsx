'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import { User } from '@prisma/client'
import AdminRoute from '@/components/AdminRoute'

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin })
      })
      if (!response.ok) throw new Error('Failed to update user')
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <AdminRoute>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-1">Users</h1>
            <p className="text-muted mb-0">Manage user roles and permissions</p>
          </div>
        </div>

        <Table hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Form.Check
                    type="switch"
                    checked={user.isAdmin}
                    onChange={(e) => toggleAdmin(user.id, e.target.checked)}
                  />
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this user?')) {
                        // TODO: Implement user deletion
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminRoute>
  )
} 