'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import CategoryList from '@/components/CategoryList'
import ResourceLightbox from '@/components/ResourceLightbox'
import type { Resource, Category, User, ContentType } from '@prisma/client'

// Check if we're on the client side - do this once at module level
const isClient = typeof window !== 'undefined'

interface ResourceWithRelations extends Resource {
  category?: Category | null
  favoritedBy?: { id: string }[]
  completedBy?: { id: string }[]
}

// Empty resource placeholder to show while loading
const emptyResource: ResourceWithRelations = {
  id: '',
  title: 'Loading...',
  description: '',
  url: '',
  additionalUrls: [],
  previewImage: '',
  contentType: 'Resource',
  categoryId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  submittedById: '',
  category: null,
  favoritedBy: [],
  completedBy: []
}

export default function Home() {
  const { data: session, status } = useSession()
  
  const [resourceId, setResourceId] = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<ResourceWithRelations | null>(null)
  const [showLightbox, setShowLightbox] = useState(false)
  
  // Cache resources to make subsequent loads instant
  const resourceCache = useRef<Record<string, ResourceWithRelations>>({})
  
  // Track if we're currently in a URL-only update to avoid unnecessary processing
  const urlUpdateInProgress = useRef(false)
  
  // Preload resources on hover to make opening them instant
  const [hoveredResourceId, setHoveredResourceId] = useState<string | null>(null)
  
  // Extract path information for initial filters (if navigating via direct URL like /ai/resource)
  const [initialCategoryFilter, setInitialCategoryFilter] = useState<string | null>(null)
  const [initialContentTypeFilter, setInitialContentTypeFilter] = useState<string | null>(null)

  // Check URL path on initial load client-side only
  useEffect(() => {
    if (!isClient) return
    
    try {
      // Get the pathname and remove the leading /
      const path = window.location.pathname.slice(1)
      if (!path) return
      
      const pathParts = path.split('/')
      
      // First check if the first segment could be a content type (for /type routes)
      if (pathParts.length === 1) {
        const typeSlug = pathParts[0].toLowerCase()
        const contentTypes = ['resource', 'training', 'shortcut', 'plugin']
        
        if (contentTypes.includes(typeSlug)) {
          // If it's a content type, set that filter
          const contentType = typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1)
          setInitialContentTypeFilter(contentType as ContentType)
          return // Don't process it as a category
        }
      }
      
      // If we got here and have a first segment, treat it as a category slug
      if (pathParts.length > 0 && pathParts[0]) {
        // Fetch categories to find matching slug and set filter
        fetch('/api/categories')
          .then(res => res.json())
          .then(categories => {
            const matchingCategory = categories.find(
              (c: any) => c.name.toLowerCase().replace(/\s+/g, '-') === pathParts[0]
            )
            if (matchingCategory) {
              setInitialCategoryFilter(matchingCategory.id)
            }
          })
          .catch(err => console.error('Error fetching categories for URL match:', err))
      }
      
      // If we have a second path segment, it might be a content type
      if (pathParts.length > 1 && pathParts[1]) {
        const typeSlug = pathParts[1].toLowerCase()
        const contentTypes = ['resource', 'training', 'shortcut', 'plugin']
        
        if (contentTypes.includes(typeSlug)) {
          const contentType = typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1)
          setInitialContentTypeFilter(contentType as ContentType)
        }
      }
    } catch (error) {
      console.error('Error parsing URL path:', error)
    }
  }, [])
  
  // Update URL without causing page reload - safe for server
  const updateUrl = useCallback((id: string | null) => {
    if (!isClient) return
    
    urlUpdateInProgress.current = true
    
    try {
      if (id) {
        // Set URL hash directly
        window.history.pushState({resourceId: id}, "", `#resource=${id}`)
      } else {
        // Clear hash without navigating
        const scrollPosition = window.pageYOffset
        history.replaceState(null, '', window.location.pathname)
        window.scrollTo(0, scrollPosition)
      }
    } catch (error) {
      console.error('Error updating URL:', error)
    }
    
    // Small delay to prevent race conditions
    setTimeout(() => {
      urlUpdateInProgress.current = false
    }, 50)
  }, [])
  
  // Preload a resource into cache - safe for server
  const preloadResource = useCallback(async (id: string) => {
    if (!id || resourceCache.current[id]) return
    
    try {
      const response = await fetch(`/api/resources/${id}`)
      if (response.ok) {
        const resource = await response.json()
        resourceCache.current[id] = resource
        
        // Preload the image too if it exists (client-side only)
        if (isClient && resource.previewImage) {
          try {
            const img = new Image()
            img.src = resource.previewImage
          } catch (err) {
            console.error('Error preloading image:', err)
          }
        }
      }
    } catch (error) {
      console.error('Error preloading resource:', error)
    }
  }, [])
  
  // Load resource without affecting UI - safe for server
  const loadResource = useCallback(async (id: string): Promise<ResourceWithRelations | null> => {
    // Check cache first
    if (resourceCache.current[id]) {
      return resourceCache.current[id]
    }
    
    try {
      const response = await fetch(`/api/resources/${id}`)
      if (!response.ok) throw new Error(`Failed to fetch resource: ${response.status}`)
      
      const resource = await response.json()
      
      // Cache the result
      resourceCache.current[id] = resource
      
      return resource
    } catch (error) {
      console.error('Error fetching resource:', error)
      return null
    }
  }, [])
  
  // Close the resource - safe for server
  const closeResource = useCallback(() => {
    if (!showLightbox) return
    
    // Hide the modal with animation
    setShowLightbox(false)
    
    // Server-safe update
    if (isClient) {
      // Use safe timeout function
      setTimeout(() => {
        // Only update URL and resource ID
        updateUrl(null)
        setResourceId(null)
        
        // Only clear the resource after modal is completely hidden
        setTimeout(() => {
          setSelectedResource(null)
        }, 100)
      }, 300)
    } else {
      // No animations on server - immediately clear all
      updateUrl(null)
      setResourceId(null)
      setSelectedResource(null)
    }
  }, [showLightbox, updateUrl])
  
  // Show resource - safe for server
  const showResource = useCallback(async (id: string) => {
    if (!id) return
    
    try {
      // First update URL silently
      updateUrl(id)
      
      // Set resource ID 
      setResourceId(id)
      
      // Use cached resource or placeholder while loading
      if (resourceCache.current[id]) {
        // Set the resource BEFORE showing the lightbox
        setSelectedResource(resourceCache.current[id])
        
        // Show modal with a delay on client
        if (isClient) {
          // Use safe timeout instead of requestAnimationFrame
          setTimeout(() => {
            setShowLightbox(true)
          }, 0)
        } else {
          // No delay needed on server
          setShowLightbox(true)
        }
      } else {
        // If not cached, use empty placeholder and show modal immediately
        setSelectedResource(emptyResource)
        
        // Show with a tiny delay to ensure CSS transitions
        if (isClient) {
          setTimeout(() => {
            setShowLightbox(true)
          }, 0)
        } else {
          setShowLightbox(true)
        }
        
        // Then load the real data in background
        const resource = await loadResource(id)
        if (resource) {
          // Update data without closing/reopening modal
          setSelectedResource(resource)
        } else {
          closeResource()
        }
      }
    } catch (error) {
      console.error('Error showing resource:', error)
      closeResource()
    }
  }, [updateUrl, loadResource, closeResource])
  
  // Handle hover to preload resources - safe for server
  const handleResourceHover = useCallback((id: string | null) => {
    setHoveredResourceId(id)
    if (id && isClient) preloadResource(id)
  }, [preloadResource])
  
  // Check URL on initial load and handle URL changes - client-side only
  useEffect(() => {
    if (!isClient) return
    
    // Skip if we're in the middle of our own URL update
    const handleUrlChange = () => {
      try {
        if (urlUpdateInProgress.current) return
        
        const hash = window.location.hash.slice(1)
        const params = new URLSearchParams(hash)
        const id = params.get('resource')
        
        if (id && id !== resourceId) {
          showResource(id)
        } else if (!id && resourceId && showLightbox) {
          closeResource()
        }
      } catch (error) {
        console.error('Error handling URL change:', error)
      }
    }
    
    // Check URL on mount
    handleUrlChange()
    
    // Listen for URL changes
    window.addEventListener('hashchange', handleUrlChange)
    window.addEventListener('popstate', handleUrlChange)
    
    return () => {
      window.removeEventListener('hashchange', handleUrlChange)
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [resourceId, showResource, closeResource, showLightbox])
  
  // Preload hovered resource - safe for server
  useEffect(() => {
    if (hoveredResourceId && isClient) {
      preloadResource(hoveredResourceId)
    }
  }, [hoveredResourceId, preloadResource])
  
  // Aggressive preloading of popular resources on initial load - client-side only
  useEffect(() => {
    if (!isClient) return
    
    // Ensure we preload the 5 most recent resources when the app starts
    const preloadInitialResources = async () => {
      try {
        const response = await fetch('/api/resources?limit=5')
        if (response.ok) {
          const resources = await response.json()
          resources.forEach((resource: ResourceWithRelations) => {
            resourceCache.current[resource.id] = resource
            
            // Preload images too - with error handling
            if (resource.previewImage) {
              try {
                const img = new Image()
                img.src = resource.previewImage
              } catch (err) {
                console.error('Error preloading image:', err)
              }
            }
          })
        }
      } catch (error) {
        console.error('Error preloading resources:', error)
      }
    }
    
    preloadInitialResources()
  }, [])
  
  // Toggle favorite/complete handlers (optimized to avoid reloads) - safe for server
  const handleToggleFavorite = async () => {
    if (!selectedResource || !session?.user) return
    
    try {
      // Optimistic update
      const wasAlreadyFavorite = selectedResource.favoritedBy?.some(u => u.id === session.user?.id)
      
      // Update UI immediately
      setSelectedResource(current => {
        if (!current) return null
        
        return {
          ...current,
          favoritedBy: wasAlreadyFavorite
            ? (current.favoritedBy || []).filter(u => u.id !== session.user?.id)
            : [...(current.favoritedBy || []), { id: session.user.id }]
        }
      })
      
      // Then send to API
      const response = await fetch(`/api/resources/${selectedResource.id}/favorite`, { 
        method: 'POST' 
      })
      
      if (!response.ok) throw new Error('Failed to toggle favorite')
      
      // If there's a cached version, update it
      if (resourceId && resourceCache.current[resourceId]) {
        const resource = await loadResource(resourceId)
        if (resource) {
          resourceCache.current[resourceId] = resource
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }
  
  const handleToggleComplete = async () => {
    if (!selectedResource || !session?.user) return
    
    try {
      // Optimistic update
      const wasAlreadyCompleted = selectedResource.completedBy?.some(u => u.id === session.user?.id)
      
      // Update UI immediately
      setSelectedResource(current => {
        if (!current) return null
        
        return {
          ...current,
          completedBy: wasAlreadyCompleted
            ? (current.completedBy || []).filter(u => u.id !== session.user?.id)
            : [...(current.completedBy || []), { id: session.user.id }]
        }
      })
      
      // Then send to API
      const response = await fetch(`/api/resources/${selectedResource.id}/complete`, { 
        method: 'POST' 
      })
      
      if (!response.ok) throw new Error('Failed to toggle complete')
      
      // If there's a cached version, update it
      if (resourceId && resourceCache.current[resourceId]) {
        const resource = await loadResource(resourceId)
        if (resource) {
          resourceCache.current[resourceId] = resource
        }
      }
    } catch (error) {
      console.error('Error toggling complete:', error)
    }
  }
  
  // Listen for debug events (for production troubleshooting)
  useEffect(() => {
    if (!isClient) return
    
    const handleDebugEvent = (e: Event) => {
      // Debug events are silenced in production
    };
    
    document.addEventListener('resource-click', handleDebugEvent);
    return () => document.removeEventListener('resource-click', handleDebugEvent);
  }, []);
  
  if (status === 'loading') {
    return null
  }
  
  return (
    <>
      <CategoryList 
        resourceId={resourceId}
        onResourceClick={showResource}
        onResourceHover={handleResourceHover}
        initialCategoryFilter={initialCategoryFilter}
        initialContentTypeFilter={initialContentTypeFilter}
      />
      
      {/* Always render the lightbox with empty data when not showing */}
      <ResourceLightbox
        resource={selectedResource || emptyResource}
        show={showLightbox}
        onHide={closeResource}
        isFavorite={selectedResource?.favoritedBy?.some(u => u.id === session?.user?.id) || false}
        isCompleted={selectedResource?.completedBy?.some(u => u.id === session?.user?.id) || false}
        onToggleFavorite={handleToggleFavorite}
        onToggleComplete={handleToggleComplete}
      />
    </>
  )
} 