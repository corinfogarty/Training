'use client'

import { useState, useEffect } from 'react'
import { Table, ProgressBar, Card, Dropdown } from 'react-bootstrap'

interface PathwayProgress {
  id: string
  title: string
  description: string
  totalResources: number
  completedResources: number
  progress: number
}

interface PathwayProgressProps {
  userId: string
  className?: string
}

type SortField = 'title' | 'progress' | 'completed'
type SortDirection = 'asc' | 'desc'

export default function PathwayProgress({ userId, className = '' }: PathwayProgressProps) {
  const [pathways, setPathways] = useState<PathwayProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  useEffect(() => {
    fetchPathwayProgress()
  }, [userId])

  const fetchPathwayProgress = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/pathway-progress?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch pathway progress')
      const data = await response.json()
      setPathways(data)
    } catch (error) {
      console.error('Error fetching pathway progress:', error)
    } finally {
      setLoading(false)
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

  if (pathways.length === 0) {
    return (
      <Card className={className}>
        <Card.Body>
          <Card.Title>Pathway Progress</Card.Title>
          <div className="text-muted">No pathways available.</div>
        </Card.Body>
      </Card>
    )
  }

  const totalPathwayResources = pathways.reduce((sum, p) => sum + p.totalResources, 0)
  const totalPathwayCompleted = pathways.reduce((sum, p) => sum + p.completedResources, 0)
  const overallProgress = totalPathwayResources > 0 
    ? (totalPathwayCompleted / totalPathwayResources) * 100 
    : 0

  const sortedPathways = [...pathways].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'progress':
        comparison = a.progress - b.progress
        break
      case 'completed':
        comparison = a.completedResources - b.completedResources
        break
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className={className}>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Overall Pathway Progress</Card.Title>
          <ProgressBar 
            now={overallProgress} 
            label={`${Math.round(overallProgress)}%`}
            className="mb-2"
          />
          <div className="text-muted small">
            {totalPathwayCompleted} of {totalPathwayResources} pathway resources completed
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-end mb-3">
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" size="sm">
            Sort by: {sortField} ({sortDirection})
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => toggleSort('title')}>
              Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => toggleSort('progress')}>
              Progress {sortField === 'progress' && (sortDirection === 'asc' ? '↑' : '↓')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => toggleSort('completed')}>
              Completed {sortField === 'completed' && (sortDirection === 'asc' ? '↑' : '↓')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Table hover responsive>
        <thead>
          <tr>
            <th onClick={() => toggleSort('title')} style={{ cursor: 'pointer' }}>
              Pathway {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => toggleSort('progress')} style={{ cursor: 'pointer' }}>
              Progress {sortField === 'progress' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => toggleSort('completed')} style={{ cursor: 'pointer' }}>
              Completed {sortField === 'completed' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sortedPathways.map((pathway) => (
            <tr key={pathway.id}>
              <td>
                <div>
                  <strong>{pathway.title}</strong>
                  <div className="text-muted small">{pathway.description}</div>
                </div>
              </td>
              <td style={{ width: '30%' }}>
                <ProgressBar 
                  now={pathway.progress} 
                  label={`${Math.round(pathway.progress)}%`}
                />
              </td>
              <td>{pathway.completedResources}</td>
              <td>{pathway.totalResources}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
} 