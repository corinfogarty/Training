'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export function useResourceState() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const handleToggleFavorite = useCallback(async (resourceId: string) => {
    if (!session?.user) return
    try {
      setLoading(true)
      const response = await fetch(`/api/resources/${resourceId}/favorite`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to toggle favorite')
      return await response.json()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }, [session])

  const handleToggleComplete = useCallback(async (resourceId: string) => {
    if (!session?.user) return
    try {
      setLoading(true)
      const response = await fetch(`/api/resources/${resourceId}/complete`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to toggle complete')
      return await response.json()
    } catch (error) {
      console.error('Error toggling complete:', error)
    } finally {
      setLoading(false)
    }
  }, [session])

  const handleDelete = useCallback(async (resourceId: string) => {
    if (!session?.user) return
    try {
      setLoading(true)
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete resource')
      return true
    } catch (error) {
      console.error('Error deleting resource:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [session])

  return {
    loading,
    handleToggleFavorite,
    handleToggleComplete,
    handleDelete
  }
} 