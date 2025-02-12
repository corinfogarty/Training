'use client'

import { useState, useEffect } from 'react'
import { Table, Form, Alert, Spinner, Button, Nav, Tab, Tabs, Badge } from 'react-bootstrap'
import type { User } from '@prisma/client'
import { Search, ArrowLeft, Trophy, Star, BookOpen, Award, Crown, Medal } from 'lucide-react'
import UserProgress from '../UserProgress'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import PathwayProgress from '../PathwayProgress'

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
  rank?: number
  score?: number
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

  const calculateUserScore = (user: UserWithCounts) => {
    // Weight different actions
    const submittedWeight = 5
    const completedWeight = 3
    const favoritedWeight = 1

    return (
      user._count.submittedResources * submittedWeight +
      user._count.completed * completedWeight +
      user._count.favorites * favoritedWeight
    )
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={20} className="text-warning" />
      case 2:
        return <Medal size={20} className="text-secondary" />
      case 3:
        return <Medal size={20} className="text-orange" />
      default:
        return null
    }
  }

  const getAchievementBadges = (user: UserWithCounts) => {
    const badges = []
    
    // Content Creator badge
    if (user._count.submittedResources >= 5) {
      badges.push(
        <Badge bg="primary" className="me-1" key="creator" title="Content Creator: Submitted 5+ resources">
          <Star size={12} className="me-1" />
          Creator
        </Badge>
      )
    }
    
    // Learning Champion badge
    if (user._count.completed >= 10) {
      badges.push(
        <Badge bg="success" className="me-1" key="champion" title="Learning Champion: Completed 10+ resources">
          <Trophy size={12} className="me-1" />
          Champion
        </Badge>
      )
    }
    
    // Curator badge
    if (user._count.favorites >= 15) {
      badges.push(
        <Badge bg="warning" className="text-dark me-1" key="curator" title="Curator: Favorited 15+ resources">
          <BookOpen size={12} className="me-1" />
          Curator
        </Badge>
      )
    }

    // Active Learner badge
    if (user.lastLogin && new Date().getTime() - new Date(user.lastLogin).getTime() < 7 * 24 * 60 * 60 * 1000) {
      badges.push(
        <Badge bg="info" className="me-1" key="active" title="Active Learner: Active in the last 7 days">
          <Award size={12} className="me-1" />
          Active
        </Badge>
      )
    }

    return badges
  }

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
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
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

          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="d-flex align-items-center">
              <span className="badge bg-dark me-2">
                Score: {calculateUserScore(selectedUser)}
              </span>
              {selectedUser.rank && selectedUser.rank <= 3 && getRankBadge(selectedUser.rank)}
            </div>
            <div className="d-flex flex-wrap gap-1">
              {getAchievementBadges(selectedUser)}
            </div>
          </div>
        </div>

        <Tabs defaultActiveKey="progress" className="mb-3">
          <Tab eventKey="progress" title="Resources">
            <UserProgress userId={selectedUser.id} />
          </Tab>
          <Tab eventKey="pathways" title="Pathways">
            <PathwayProgress userId={selectedUser.id} />
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

  if (!selectedUser) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Leaderboard</h1>
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
          <Table hover responsive className="align-middle">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Rank</th>
                <th>Team Member</th>
                <th>Achievements</th>
                <th className="text-center">Score</th>
                <th className="text-center">Submitted</th>
                <th className="text-center">Completed</th>
                <th className="text-center">Favorited</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers
                .map(user => ({
                  ...user,
                  score: calculateUserScore(user)
                }))
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .map((user, index) => ({
                  ...user,
                  rank: index + 1
                }))
                .map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => handleUserClick(user)} 
                    style={{ cursor: 'pointer' }}
                    className={user.rank && user.rank <= 3 ? 'table-warning' : undefined}
                  >
                    <td className="text-center">
                      {getRankBadge(user.rank || 0) || user.rank}
                    </td>
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
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {getAchievementBadges(user)}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-dark">{user.score}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-primary">{user._count.submittedResources}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success">{user._count.completed}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-warning text-dark">{user._count.favorites}</span>
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
            {filteredUsers.map((user, index) => (
              <tr 
                key={user.id}
                onClick={() => handleUserClick(user)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div className="d-flex align-items-center">
                    {getRankBadge(index + 1)}
                    <div className="ms-2">
                      <div>{user.name || user.email}</div>
                      <div className="small text-muted">{user.email}</div>
                      <div>{getAchievementBadges(user)}</div>
                    </div>
                  </div>
                </td>
                <td>{user._count.submittedResources}</td>
                <td>{user._count.favorites}</td>
                <td>{user._count.completed}</td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
} 