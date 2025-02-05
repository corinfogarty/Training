'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import CategoryList from '@/components/CategoryList'
import ResourceLightbox from '@/components/ResourceLightbox'
import type { Resource, Category, User } from '@prisma/client'

interface ResourceWithRelations extends Resource {
  category?: Category | null
  favoritedBy?: { id: string }[]
  completedBy?: { id: string }[]
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const resourceId = searchParams.get('resource')
  
  const [selectedResource, setSelectedResource] = useState<ResourceWithRelations | null>(null)
  const [showLightbox, setShowLightbox] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (resourceId) {
      fetchResource(resourceId)
    } else {
      setShowLightbox(false)
      setSelectedResource(null)
    }
  }, [resourceId])

  const fetchResource = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/resources/${id}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Resource fetch failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(`Failed to fetch resource: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      setSelectedResource(data)
      setShowLightbox(true)
    } catch (error) {
      console.error('Error fetching resource:', error)
      router.push('/', { scroll: false })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLightboxClose = () => {
    setShowLightbox(false)
    setSelectedResource(null)
    router.push('/', { scroll: false })
  }

  const handleToggleFavorite = async () => {
    if (!selectedResource || !session?.user) return
    try {
      const response = await fetch(`/api/resources/${selectedResource.id}/favorite`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to toggle favorite')
      await fetchResource(selectedResource.id)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleToggleComplete = async () => {
    if (!selectedResource || !session?.user) return
    try {
      const response = await fetch(`/api/resources/${selectedResource.id}/complete`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to toggle complete')
      await fetchResource(selectedResource.id)
    } catch (error) {
      console.error('Error toggling complete:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedResource) return
    try {
      await fetchResource(selectedResource.id)
    } catch (error) {
      console.error('Error refreshing resource:', error)
    }
  }

  if (status === 'loading') {
    return null
  }

  return (
    <>
      <CategoryList />
      {isLoading && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {selectedResource && !isLoading && (
        <ResourceLightbox
          resource={selectedResource}
          show={showLightbox}
          onHide={handleLightboxClose}
          onEdit={handleEdit}
          isFavorite={selectedResource.favoritedBy?.some(u => u.id === session?.user?.id)}
          isCompleted={selectedResource.completedBy?.some(u => u.id === session?.user?.id)}
          onToggleFavorite={handleToggleFavorite}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </>
  )
} 