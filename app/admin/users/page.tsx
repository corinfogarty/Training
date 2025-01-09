'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import { User, Resource, CompletedResource } from '@prisma/client'
import AdminRoute from '@/components/AdminRoute'
import UserDetailsModal from '@/components/admin/UserDetailsModal'

type UserWithDetails = User & {
  completedResources: (CompletedResource & {
    resource: Resource
  })[]
  favorites: Resource[]
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
  const [showModal, setShowModal] = useState(false)

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

  const handleShowDetails = (user: UserWithDetails) => {
    setSelectedUser(user)
    setShowModal(true)
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
              <th>Last Login</th>
              <th>Completed</th>
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
                <td>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : 'Never'}
                </td>
                <td>{user.completedResources.length}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowDetails(user)}
                  >
                    Details
                  </Button>
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

        <UserDetailsModal
          user={selectedUser}
          show={showModal}
          onHide={() => {
            setShowModal(false)
            setSelectedUser(null)
          }}
        />
      </div>
    </AdminRoute>
  )
} 