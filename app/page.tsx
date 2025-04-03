'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import CategoryList from '@/components/CategoryList'
import ResourceLightbox from '@/components/ResourceLightbox'
import type { Resource, Category, User } from '@prisma/client'

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
  
  // Update URL without causing page reload - safe for server
  const updateUrl = useCallback((id: string | null) => {
    if (!isClient) return
    
    console.log('🔍 updateUrl called with id:', id);
    urlUpdateInProgress.current = true
    
    try {
      if (id) {
        // Set URL hash directly
        console.log('🔍 Setting hash to:', `resource=${id}`);
        window.history.pushState({resourceId: id}, "", `#resource=${id}`)
        // Verify the hash was set
        console.log('🔍 Hash is now:', window.location.hash);
      } else {
        // Clear hash without navigating
        console.log('🔍 Clearing hash');
        const scrollPosition = window.pageYOffset
        history.replaceState(null, '', window.location.pathname)
        window.scrollTo(0, scrollPosition)
        // Verify the hash was cleared
        console.log('🔍 Hash is now:', window.location.hash);
      }
    } catch (error) {
      console.error('❌ Error updating URL:', error)
    }
    
    // Small delay to prevent race conditions
    setTimeout(() => {
      urlUpdateInProgress.current = false
      console.log('🔍 urlUpdateInProgress set to false');
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
      // Add a custom event for debugging in production
      if (isClient) {
        const debugEvent = new CustomEvent('resource-click', { 
          detail: { id, timestamp: new Date().toISOString() } 
        });
        document.dispatchEvent(debugEvent);
      }
      
      // First update URL silently
      updateUrl(id)
      
      // Set resource ID 
      setResourceId(id)
      
      // Use cached resource or placeholder while loading
      if (resourceCache.current[id]) {
        // Set the resource BEFORE showing the lightbox
        setSelectedResource(resourceCache.current[id])
        console.log('🔍 Using cached resource:', id)
        
        // Show modal with a delay on client
        if (isClient) {
          // Use safe timeout instead of requestAnimationFrame
          setTimeout(() => {
            console.log('🔍 Setting showLightbox to true (cached)')
            setShowLightbox(true)
          }, 0)
        } else {
          // No delay needed on server
          setShowLightbox(true)
        }
      } else {
        // If not cached, use empty placeholder and show modal immediately
        setSelectedResource(emptyResource)
        console.log('🔍 Using empty placeholder while loading:', id)
        
        // Show with a tiny delay to ensure CSS transitions
        if (isClient) {
          setTimeout(() => {
            console.log('🔍 Setting showLightbox to true (placeholder)')
            setShowLightbox(true)
          }, 0)
        } else {
          setShowLightbox(true)
        }
        
        // Then load the real data in background
        const resource = await loadResource(id)
        console.log('🔍 Loaded resource from API:', resource?.id || 'null')
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
      const customEvent = e as CustomEvent;
      console.log('🐛 Resource click debug event:', customEvent.detail);
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