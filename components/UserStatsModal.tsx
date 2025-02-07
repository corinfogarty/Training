'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Nav, Spinner, Alert, Tab, Tabs } from 'react-bootstrap'
import { Calendar, ArrowLeft } from 'lucide-react'
import type { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import UserProgress from '@/components/UserProgress'

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
  _count: {
    submittedResources: number
    favorites: number
    completed: number
  }
}

interface UserStatsModalProps {
  user: UserWithCounts
  show: boolean
  onHide: () => void
  onShow?: () => void
}

export default function UserStatsModal({ user, show, onHide, onShow }: UserStatsModalProps) {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UserStatsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'submitted' | 'favorites' | 'completed'>('submitted')

  useEffect(() => {
    if (show) {
      fetchStats()
      onShow?.()
    } else {
      setStats(null)
      setActiveTab('submitted')
    }
  }, [show, user.id, onShow])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/users/${user.id}/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load user stats')
    } finally {
      setLoading(false)
    }
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

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString()
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Button variant="link" className="me-2 p-0" onClick={onHide}>
          <ArrowLeft size={20} />
        </Button>
        <Modal.Title className="d-flex align-items-center">
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
            <div>{user.name || 'Anonymous'}</div>
            <div className="small text-muted">{user.email}</div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="progress" className="mb-3">
          <Tab eventKey="progress" title="Progress">
            <UserProgress userId={user.id} />
          </Tab>
          <Tab eventKey="stats" title="Stats">
            <div className="text-muted">
              <div>Email: {user.email}</div>
              <div>Member since: {formatDate(user.createdAt)}</div>
              <div>Last login: {formatDate(user.lastLogin || user.updatedAt)}</div>
            </div>
          </Tab>
        </Tabs>

        {session?.user?.id === user.id || session?.user?.isAdmin ? (
          <>
            <Nav variant="tabs" className="mb-3">
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

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : stats ? (
              <>
                {activeTab === 'submitted' && renderResourceList(stats.submitted.resources, 'submitted')}
                {activeTab === 'favorites' && renderResourceList(stats.favorited.resources, 'favorites')}
                {activeTab === 'completed' && renderResourceList(stats.completed.resources, 'completed')}
              </>
            ) : null}
          </>
        ) : (
          <Alert variant="info">
            Detailed statistics are only visible to the user themselves and administrators.
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  )
} 