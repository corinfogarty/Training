import { useState, useEffect } from 'react'
import { Table, ProgressBar } from 'react-bootstrap'
import type { Category } from '@prisma/client'

interface CategoryProgress {
  id: string
  name: string
  description: string | null
  totalResources: number
  completedResources: number
  favoriteResources: number
}

interface UserProgressProps {
  userId: string
  className?: string
}

export default function UserProgress({ userId, className = '' }: UserProgressProps) {
  const [progress, setProgress] = useState<CategoryProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [userId])

  const fetchProgress = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/progress?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch progress')
      const data = await response.json()
      setProgress(data)
    } catch (error) {
      console.error('Error fetching progress:', error)
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

  const totalResources = progress.reduce((sum, cat) => sum + cat.totalResources, 0)
  const totalCompleted = progress.reduce((sum, cat) => sum + cat.completedResources, 0)
  const totalProgress = totalResources > 0 ? (totalCompleted / totalResources) * 100 : 0

  return (
    <div className={className}>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Overall Progress</h5>
          <ProgressBar 
            now={totalProgress} 
            label={`${Math.round(totalProgress)}%`}
            className="mb-2"
          />
          <div className="text-muted small">
            {totalCompleted} of {totalResources} resources completed
          </div>
        </div>
      </div>

      <Table hover responsive>
        <thead>
          <tr>
            <th>Category</th>
            <th>Progress</th>
            <th>Completed</th>
            <th>Favorites</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {progress.map((category) => {
            const progressPercent = category.totalResources > 0 
              ? (category.completedResources / category.totalResources) * 100 
              : 0

            return (
              <tr key={category.id}>
                <td>
                  <div>
                    <strong>{category.name}</strong>
                    {category.description && (
                      <div className="text-muted small">{category.description}</div>
                    )}
                  </div>
                </td>
                <td style={{ width: '30%' }}>
                  <ProgressBar 
                    now={progressPercent} 
                    label={`${Math.round(progressPercent)}%`}
                  />
                </td>
                <td>{category.completedResources}</td>
                <td>{category.favoriteResources}</td>
                <td>{category.totalResources}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
} 