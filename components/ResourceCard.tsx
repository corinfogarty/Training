'use client'

import { useState } from 'react'
import { Resource, Category } from '@prisma/client'
import { Card, Button, Dropdown, Modal } from 'react-bootstrap'
import { MoreVertical, Star, CheckCircle, Trash2, Edit, ExternalLink, Calendar } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd'
import EditResourceModal from './EditResourceModal'
import ResourceLightbox from './ResourceLightbox'
import { signIn, useSession } from 'next-auth/react'

interface ResourceCardProps {
  resource: Resource & {
    category?: Category | null
  }
  index: number
  isFavorite?: boolean
  isCompleted?: boolean
  completedAt?: Date
  onDelete: () => void
  onToggleFavorite: () => void
  onToggleComplete: () => void
}

export default function ResourceCard({
  resource,
  index,
  isFavorite: initialIsFavorite,
  isCompleted: initialIsCompleted,
  completedAt: initialCompletedAt,
  onDelete,
  onToggleFavorite,
  onToggleComplete
}: ResourceCardProps) {
  const { data: session } = useSession()
  const [showEdit, setShowEdit] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted)
  const [completedAt, setCompletedAt] = useState(initialCompletedAt)
  const [loadingFavorite, setLoadingFavorite] = useState(false)
  const [loadingComplete, setLoadingComplete] = useState(false)

  const previewImage = resource.previewImage

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete resource')
      }
      
      setShowDeleteConfirm(false)
      onDelete()
    } catch (error) {
      console.error('Error deleting resource:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setLoadingFavorite(true)
      const response = await fetch(`/api/resources/${resource.id}/favorite`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to toggle favorite')
      
      setIsFavorite(!isFavorite)
      onToggleFavorite()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoadingFavorite(false)
    }
  }

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setLoadingComplete(true)
      const response = await fetch(`/api/resources/${resource.id}/complete`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to toggle complete')
      
      const data = await response.json()
      setIsCompleted(!isCompleted)
      setCompletedAt(data.completedAt)
      onToggleComplete()
    } catch (error) {
      console.error('Error toggling complete:', error)
    } finally {
      setLoadingComplete(false)
    }
  }

  return (
    <>
      <Draggable draggableId={resource.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-3"
            style={{ position: 'relative' }}
          >
            <Card 
              className="h-100 shadow-sm" 
              onClick={() => setShowLightbox(true)}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="card-img-top"
                style={{
                  height: '120px',
                  backgroundImage: previewImage ? `url(${previewImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#f8f9fa'
                }}
              />
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="mb-0 fw-semibold">{resource.title}</h6>
                </div>

                <div className="d-flex align-items-center gap-3 mt-3">
                  <button 
                    className="btn btn-link p-0 d-flex align-items-center" 
                    onClick={handleToggleFavorite}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    disabled={loadingFavorite}
                  >
                    <Star 
                      size={16} 
                      className={`${isFavorite ? 'text-warning' : 'text-muted'} ${loadingFavorite ? 'opacity-50' : ''}`}
                      fill={isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>

                  <button 
                    className="btn btn-link p-0 d-flex align-items-center"
                    onClick={handleToggleComplete}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    disabled={loadingComplete}
                  >
                    <CheckCircle 
                      size={16} 
                      className={`${isCompleted ? 'text-success' : 'text-muted'} ${loadingComplete ? 'opacity-50' : ''}`}
                      fill={isCompleted ? 'currentColor' : 'none'}
                    />
                  </button>

                  <button 
                    className="btn btn-link p-0 d-flex align-items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEdit(true);
                    }}
                    title="Edit resource"
                  >
                    <Edit size={16} className="text-muted" />
                  </button>

                  <button 
                    className="btn btn-link p-0 d-flex align-items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                    title="Delete resource"
                  >
                    <Trash2 size={16} className="text-danger" />
                  </button>

                  {completedAt && (
                    <div className="small text-muted d-flex align-items-center ms-auto" title="Completion date">
                      <Calendar size={12} className="me-1" />
                      {new Date(completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </Draggable>

      <EditResourceModal
        resource={resource}
        show={showEdit}
        onHide={() => setShowEdit(false)}
        onSave={onDelete}
      />

      <ResourceLightbox
        resource={resource}
        show={showLightbox}
        onHide={() => setShowLightbox(false)}
      />

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{resource.title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteConfirm(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
} 