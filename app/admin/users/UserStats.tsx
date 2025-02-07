'use client'

import { useState, useEffect } from 'react'
import { Button, Collapse } from 'react-bootstrap'
import { ChevronDown, ChevronUp } from 'lucide-react'

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

export default function UserStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState<UserStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open && !stats) {
      fetchStats()
    }
  }, [open])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${userId}/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderResourceList = (resources: Resource[], type: 'submitted' | 'favorited' | 'completed') => (
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

  return (
    <div>
      <Button
        variant="link"
        onClick={() => setOpen(!open)}
        className="text-decoration-none p-0 d-flex align-items-center gap-2"
      >
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        View Details
      </Button>

      <Collapse in={open}>
        <div>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : stats ? (
            <div className="mt-3">
              <h6 className="mb-3">Submitted Resources</h6>
              {renderResourceList(stats.submitted.resources, 'submitted')}

              <h6 className="mb-3 mt-4">Favorited Resources</h6>
              {renderResourceList(stats.favorited.resources, 'favorited')}

              <h6 className="mb-3 mt-4">Completed Resources</h6>
              {renderResourceList(stats.completed.resources, 'completed')}
            </div>
          ) : null}
        </div>
      </Collapse>
    </div>
  )
} 