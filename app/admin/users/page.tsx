'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Form, Modal } from 'react-bootstrap'
import { User } from '@prisma/client'
import AdminRoute from '@/components/AdminRoute'

interface UserWithCounts extends User {
  _count: {
    completed: number;
    favorites: number;
    resourceOrders: number;
  }
}

interface UserStatsModalProps {
  user: UserWithCounts;
  show: boolean;
  onHide: () => void;
}

interface Resource {
  id: string;
  title: string;
  contentType: string;
  category: {
    name: string;
  };
}

interface UserStats {
  completed: Resource[];
  favorites: Resource[];
  added: Resource[];
}

function UserStatsModal({ user, show, onHide }: UserStatsModalProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'completed' | 'favorites' | 'added'>('completed')

  useEffect(() => {
    if (show) {
      fetchStats()
    } else {
      setStats(null)
      setActiveTab('completed')
    }
  }, [show, user.id])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderResourceList = (resources: Resource[]) => (
    <div className="list-group">
      {resources.map(resource => (
        <div key={resource.id} className="list-group-item">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">{resource.title}</h6>
              <small className="text-muted">{resource.category.name}</small>
            </div>
            <span className="badge bg-primary">{resource.contentType}</span>
          </div>
        </div>
      ))}
      {resources.length === 0 && (
        <div className="list-group-item text-center text-muted">
          No resources found
        </div>
      )}
    </div>
  )

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Stats for {user.name || user.email}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="btn-group w-100 mb-4">
              <Button
                variant={activeTab === 'completed' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('completed')}
              >
                Completed ({user._count.completed})
              </Button>
              <Button
                variant={activeTab === 'favorites' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites ({user._count.favorites})
              </Button>
              <Button
                variant={activeTab === 'added' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('added')}
              >
                Added ({user._count.resourceOrders})
              </Button>
            </div>
            {stats && (
              <>
                {activeTab === 'completed' && renderResourceList(stats.completed)}
                {activeTab === 'favorites' && renderResourceList(stats.favorites)}
                {activeTab === 'added' && renderResourceList(stats.added)}
              </>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
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
                      <small className="d-block text-muted">Completed</small>
                      <strong>{user._count.completed}</strong>
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
                      <small className="d-block text-muted">Added</small>
                      <strong>{user._count.resourceOrders}</strong>
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
      </div>
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
    </AdminRoute>
  )
} 