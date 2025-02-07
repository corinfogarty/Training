'use client'

import { useState, useEffect } from 'react'
import { Table, Form, Alert, Spinner } from 'react-bootstrap'
import type { User } from '@prisma/client'
import UserStatsModal from '../UserStatsModal'
import { Search } from 'lucide-react'

interface UserWithCounts extends Partial<User> {
  id: string
  name: string | null
  email: string
  image: string | null
  lastLogin: Date | null
  _count: {
    submittedResources: number
    favorites: number
    completed: number
  }
}

export default function TeamProgress() {
  const [users, setUsers] = useState<UserWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserWithCounts | null>(null)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Team Progress</h1>
        <div className="d-flex align-items-center" style={{ width: '300px' }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} />
            </span>
            <Form.Control
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <Alert variant="info">
          {searchTerm ? 'No team members match your search.' : 'No team members found.'}
        </Alert>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Team Member</th>
              <th className="text-center">Submitted</th>
              <th className="text-center">Favorited</th>
              <th className="text-center">Completed</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} onClick={() => {
                setSelectedUser(user)
                setShowStatsModal(true)
              }} style={{ cursor: 'pointer' }}>
                <td>
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
                    <div>
                      <div className="text-primary">{user.name || 'Anonymous'}</div>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <span className="badge bg-primary">{user._count.submittedResources}</span>
                </td>
                <td className="text-center">
                  <span className="badge bg-warning text-dark">{user._count.favorites}</span>
                </td>
                <td className="text-center">
                  <span className="badge bg-success">{user._count.completed}</span>
                </td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selectedUser && (
        <UserStatsModal
          user={selectedUser as User}
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