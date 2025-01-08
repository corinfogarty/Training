'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import CategoryList from '@/components/CategoryList'
import ResourceLightbox from '@/components/ResourceLightbox'
import type { Resource, Category } from '@prisma/client'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [showLightbox, setShowLightbox] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error))

    const resourceId = searchParams.get('resource')
    if (resourceId && session?.user) {
      // Only fetch if it's a different resource
      if (!selectedResource || selectedResource.id !== resourceId) {
        setIsLoading(true)
        fetch(`/api/resources/${resourceId}`)
          .then(res => res.json())
          .then(data => {
            setSelectedResource(data)
            setShowLightbox(true)
          })
          .catch(() => {
            router.push('/')
          })
          .finally(() => {
            setIsLoading(false)
          })
      }
    } else {
      // Only close if we're not on a resource URL
      if (showLightbox) {
        setShowLightbox(false)
        setSelectedResource(null)
      }
    }
  }, [searchParams, session, status, selectedResource])

  const handleLightboxClose = () => {
    setShowLightbox(false)
    setSelectedResource(null)
    router.push('/', { scroll: false })
  }

  if (status === 'loading') {
    return null
  }

  return (
    <>
      <CategoryList categories={categories} />
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
        />
      )}
    </>
  )
} 