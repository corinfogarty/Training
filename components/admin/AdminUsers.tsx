'use client'

import { useState, useEffect } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import type { User } from '@prisma/client'
import UserStatsModal from '../UserStatsModal'

interface UserWithCounts extends User {
  _count: {
    submittedResources: number
    favorites: number
    completed: number
  }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserWithCounts | null>(null)
  const [showStatsModal, setShowStatsModal] = useState(false)

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
      <div className="d-flex justify-content-center align-items-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
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
            <th>User</th>
            <th>Email</th>
            <th>Stats</th>
            <th>Last Login</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="align-middle">
                <div className="d-flex align-items-center">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || ''} 
                      className="rounded-circle me-2"
                      width="32" 
                      height="32"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle me-2 bg-secondary d-flex align-items-center justify-content-center text-white"
                      style={{ width: '32px', height: '32px' }}
                    >
                      {user.name?.[0] || user.email[0]}
                    </div>
                  )}
                  <span>{user.name || 'No name'}</span>
                </div>
              </td>
              <td className="align-middle">{user.email}</td>
              <td className="align-middle">
                <div className="d-flex gap-3">
                  <div 
                    role="button" 
                    onClick={() => {
                      setSelectedUser(user)
                      setShowStatsModal(true)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <small className="d-block text-muted">Submitted</small>
                    <strong>{user._count.submittedResources}</strong>
                  </div>
                  <div 
                    role="button"
                    onClick={() => {
                      setSelectedUser(user)
                      setShowStatsModal(true)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <small className="d-block text-muted">Favorites</small>
                    <strong>{user._count.favorites}</strong>
                  </div>
                  <div 
                    role="button"
                    onClick={() => {
                      setSelectedUser(user)
                      setShowStatsModal(true)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <small className="d-block text-muted">Completed</small>
                    <strong>{user._count.completed}</strong>
                  </div>
                </div>
              </td>
              <td className="align-middle">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </td>
              <td className="align-middle">
                <Form.Check
                  type="switch"
                  checked={user.isAdmin}
                  onChange={(e) => toggleAdmin(user.id, e.target.checked)}
                />
              </td>
              <td className="align-middle">
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

      {selectedUser && (
        <UserStatsModal
          user={selectedUser}
          show={showStatsModal}
          onHide={() => {
            setShowStatsModal(false)
            setSelectedUser(null)
          }}
        />
      )}
    </div>
  )
} 