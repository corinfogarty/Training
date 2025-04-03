'use client'

import { useState, useEffect } from 'react'
import { Resource, Category } from '@prisma/client'
import { Card, Button, Dropdown, Modal } from 'react-bootstrap'
import { MoreVertical, Star, CheckCircle, Trash2, Edit, ExternalLink, Calendar } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ResourceLightbox from './ResourceLightbox'

interface ResourceCardProps {
  resource: Resource & {
    category?: Category | null
    submittedBy?: {
      id: string
      name?: string | null
      email: string
      image?: string | null
    } | null
  }
  index?: number
  isFavorite?: boolean
  isCompleted?: boolean
  completedAt?: Date
  onDelete?: () => void
  onToggleFavorite?: () => void
  onToggleComplete?: () => void
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  standalone?: boolean
  viewType?: 'grid' | 'list' | 'columns'
}

export default function ResourceCard({
  resource: initialResource,
  index = 0,
  isFavorite,
  isCompleted,
  completedAt,
  onDelete = () => {},
  onToggleFavorite = () => {},
  onToggleComplete = () => {},
  onClick,
  onMouseEnter,
  onMouseLeave,
  standalone = false,
  viewType = 'grid'
}: ResourceCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [resource, setResource] = useState(initialResource)

  useEffect(() => {
    setResource(initialResource)
  }, [initialResource])

  const previewImage = resource.previewImage

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('🔍 ResourceCard.handleCardClick called for resource:', resource.id, resource.title)
    
    if (true) { // Always try the onClick path first
      console.log('🔍 Calling onClick callback if available')
      if (onClick) {
        onClick()
        return false
      } else if (standalone) {
        console.log('🔍 Opening resource URL in new tab:', resource.url)
        window.open(resource.url, '_blank')
        return false
      }
    }
    return false
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete resource')
      }
      
      setShowDeleteConfirm(false)
      onDelete()
    } catch (error) {
      console.error('Error deleting resource:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleResourceUpdate = async (updatedResource: typeof resource) => {
    try {
      // Fetch the fresh data from the API to ensure we have all relations
      const response = await fetch(`/api/resources/${updatedResource.id}`);
      if (!response.ok) throw new Error('Failed to fetch updated resource');
      const freshResource = await response.json();
      
      setResource(freshResource);
      setShowEdit(false);
      // Still call onDelete to refresh the parent list if needed
      onDelete();
    } catch (error) {
      console.error('Error refreshing resource:', error);
      // Fall back to using the passed resource if fetch fails
      setResource(updatedResource);
      setShowEdit(false);
      onDelete();
    }
  }
} 