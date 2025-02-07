'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ResourceCard from '@/components/ResourceCard'
import { Container } from 'react-bootstrap'
import type { Resource, Category } from '@prisma/client'

interface ResourceWithRelations extends Resource {
  category: Category | null
  favoritedBy: { id: string }[]
  completedBy: { id: string }[]
  isFavorite: boolean
  isCompleted: boolean
  submittedBy?: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  } | null
}

interface ResourceViewProps {
  resourceId: string
}

const ResourceView = ({ resourceId }: ResourceViewProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resource, setResource] = useState<ResourceWithRelations | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/resources/${resourceId}`))
      return
    }

    if (status === 'authenticated') {
      fetchResource()
    }
  }, [status, resourceId])

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/')
          return
        }
        throw new Error('Failed to fetch resource')
      }
      const data = await response.json()
      setResource(data)
    } catch (error) {
      console.error('Error fetching resource:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!session?.user || !resource) return
    try {
      const response = await fetch(`/api/resources/${resource.id}/favorite`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to toggle favorite')
      const data = await response.json()
      setResource(prev => prev ? {
        ...prev,
        isFavorite: data.isFavorite,
        favoritedBy: data.isFavorite
          ? [...prev.favoritedBy, { id: session.user.id }]
          : prev.favoritedBy.filter((u: { id: string }) => u.id !== session.user.id)
      } : null)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleToggleComplete = async () => {
    if (!session?.user || !resource) return
    try {
      const response = await fetch(`/api/resources/${resource.id}/complete`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to toggle complete')
      const data = await response.json()
      setResource(prev => prev ? {
        ...prev,
        isCompleted: data.isCompleted,
        completedBy: data.isCompleted
          ? [...prev.completedBy, { id: session.user.id }]
          : prev.completedBy.filter((u: { id: string }) => u.id !== session.user.id)
      } : null)
    } catch (error) {
      console.error('Error toggling complete:', error)
    }
  }

  if (loading || !resource) {
    return (
      <div className="bg-dark text-white min-vh-100">
        <Container className="py-5">
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="bg-dark text-white min-vh-100">
      <Container className="py-5">
        <ResourceCard
          resource={resource}
          standalone={true}
          isFavorite={resource.isFavorite}
          isCompleted={resource.isCompleted}
          onToggleFavorite={handleToggleFavorite}
          onToggleComplete={handleToggleComplete}
          onDelete={async () => {
            await fetch(`/api/resources/${resource.id}`, {
              method: 'DELETE'
            })
            router.push('/')
          }}
        />
      </Container>
    </div>
  )
}

export default ResourceView 