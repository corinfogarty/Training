'use client'

import { useState, useEffect } from 'react'
import { Table, Form, Alert, Spinner, Button, Nav, Tab, Tabs } from 'react-bootstrap'
import type { User } from '@prisma/client'
import { Search, ArrowLeft } from 'lucide-react'
import UserProgress from '../UserProgress'
import { useSession } from 'next-auth/react'

interface Resource {
  id: string
  title: string
  category: string
  createdAt?: string
  completedAt?: string
}

interface UserStatsData {
  submitted: {
    count: number
    resources: Resource[]
  }
  favorited: {
    count: number
    resources: Resource[]
  }
  completed: {
    count: number
    resources: Resource[]
  }
}

interface UserWithCounts extends Partial<User> {
  id: string
  name: string | null
  email: string
  image: string | null
  lastLogin: Date | null
  createdAt?: Date
  _count: {
    submittedResources: number
    favorites: number
    completed: number
  }
}

interface TeamProgressProps {
  onUserStatsOpen?: () => void
  onUserStatsClose?: () => void
}

export default function TeamProgress({ onUserStatsOpen, onUserStatsClose }: TeamProgressProps) {
  const { data: session } = useSession()
  const [users, setUsers] = useState<UserWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserWithCounts | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<UserStatsData | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'submitted' | 'favorites' | 'completed'>('submitted')

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchStats()
    } else {
      setStats(null)
      setActiveTab('submitted')
    }
  }, [selectedUser])

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

  const fetchStats = async () => {
    if (!selectedUser) return
    setStatsLoading(true)
    setStatsError(null)
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStatsError('Failed to load user stats')
    } finally {
      setStatsLoading(false)
    }
  }

  const handleUserClick = (user: UserWithCounts) => {
    setSelectedUser(user)
  }

  const handleBackClick = () => {
    setSelectedUser(null)
  }

  const renderResourceList = (resources: Resource[], type: 'submitted' | 'favorites' | 'completed') => (
    <div className="list-group mt-3">
      {resources.map(resource => (
        <div key={resource.id} className="list-group-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="mb-1">{resource.title}</h6>
              <small className="text-muted">{resource.category}</small>
            </div>
            <div className="text-end">
              {type === 'submitted' && resource.createdAt && (
                <small className="text-muted d-block">
                  Added: {new Date(resource.createdAt).toLocaleDateString()}
                </small>
              )}
              {type === 'completed' && resource.completedAt && (
                <small className="text-muted d-block">
                  Completed: {new Date(resource.completedAt).toLocaleDateString()}
                </small>
              )}
            </div>
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

  if (selectedUser) {
    return (
      <div className="p-4">
        <div className="d-flex align-items-center mb-4">
          <Button variant="link" className="p-0 me-3" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </Button>
          <div className="d-flex align-items-center">
            {selectedUser.image ? (
              <img 
                src={selectedUser.image} 
                alt={selectedUser.name || ''} 
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
                {selectedUser.name?.[0] || selectedUser.email[0]}
              </div>
            )}
            <div>
              <div className="h3 mb-0">{selectedUser.name || 'Anonymous'}</div>
              <div className="small text-muted">{selectedUser.email}</div>
            </div>
          </div>
        </div>

        <Tabs defaultActiveKey="progress" className="mb-3">
          <Tab eventKey="progress" title="Progress">
            <UserProgress userId={selectedUser.id} />
          </Tab>
          <Tab eventKey="stats" title="Stats">
            <div className="text-muted">
              <div>Email: {selectedUser.email}</div>
              <div>Member since: {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Never'}</div>
              <div>Last login: {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</div>
            </div>

            {session?.user?.id === selectedUser.id || session?.user?.isAdmin ? (
              <>
                <Nav variant="tabs" className="mb-3 mt-4">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'submitted'}
                      onClick={() => setActiveTab('submitted')}
                    >
                      Submitted
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'favorites'}
                      onClick={() => setActiveTab('favorites')}
                    >
                      Favorites
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'completed'}
                      onClick={() => setActiveTab('completed')}
                    >
                      Completed
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {statsLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : statsError ? (
                  <Alert variant="danger">{statsError}</Alert>
                ) : stats ? (
                  <>
                    {activeTab === 'submitted' && renderResourceList(stats.submitted.resources, 'submitted')}
                    {activeTab === 'favorites' && renderResourceList(stats.favorited.resources, 'favorites')}
                    {activeTab === 'completed' && renderResourceList(stats.completed.resources, 'completed')}
                  </>
                ) : null}
              </>
            ) : (
              <Alert variant="info" className="mt-3">
                Detailed statistics are only visible to the user themselves and administrators.
              </Alert>
            )}
          </Tab>
        </Tabs>
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
              <tr key={user.id} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }}>
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
    </div>
  )
} 