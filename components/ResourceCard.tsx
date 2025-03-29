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
    
    if (onClick) {
      onClick()
      return false;
    } else if (standalone) {
      window.open(resource.url, '_blank')
      return false;
    }
    return false;
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

  const listView = (
    <div 
      className="resource-list-item"
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">{resource.title}</h6>
          {completedAt && (
            <div className="small text-muted d-flex align-items-center">
              <Calendar size={12} className="me-1" />
              {new Date(completedAt).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="link"
            size="sm"
            className={`text-muted p-0 ${isFavorite ? 'text-warning' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Star 
              size={16} 
              fill={isFavorite ? 'currentColor' : 'none'} 
              className={isFavorite ? 'text-warning' : ''}
            />
          </Button>
          <Button
            variant="link"
            size="sm"
            className={`text-muted p-0 ${isCompleted ? 'text-success' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
          >
            <CheckCircle 
              size={16} 
              fill={isCompleted ? 'currentColor' : 'none'} 
              className={isCompleted ? 'text-success' : ''}
            />
          </Button>
          {(session?.user?.isAdmin || session?.user?.id === resource.submittedBy?.id) && (
            <>
              <Button
                variant="link"
                size="sm"
                className="text-muted p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEdit(true);
                }}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-danger p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </>
          )}
          {resource.submittedBy?.image && (
            <img 
              src={resource.submittedBy.image} 
              alt={resource.submittedBy.name || resource.submittedBy.email}
              className="rounded-circle"
              width={20}
              height={20}
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
      </div>
    </div>
  )

  const card = (
    <Card 
      className="h-100 shadow-sm" 
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ 
        cursor: 'pointer',
        position: 'relative',
        zIndex: dropdownOpen ? 1000 : 'auto'
      }}
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
      <Card.Body className="p-3 d-flex flex-column">
        <div className="mb-auto">
          <h6 className="mb-0 fw-semibold">{resource.title}</h6>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="link"
              size="sm"
              className={`text-muted p-0 ${isFavorite ? 'text-warning' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Star 
                size={16} 
                fill={isFavorite ? 'currentColor' : 'none'} 
                className={isFavorite ? 'text-warning' : ''}
              />
            </Button>
            <Button
              variant="link"
              size="sm"
              className={`text-muted p-0 ${isCompleted ? 'text-success' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete();
              }}
            >
              <CheckCircle 
                size={16} 
                fill={isCompleted ? 'currentColor' : 'none'} 
                className={isCompleted ? 'text-success' : ''}
              />
            </Button>
            {(session?.user?.isAdmin || session?.user?.id === resource.submittedBy?.id) && (
              <>
                <Button
                  variant="link"
                  size="sm"
                  className="text-muted p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEdit(true);
                  }}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            {completedAt && (
              <div className="small text-muted d-flex align-items-center">
                <Calendar size={12} className="me-1" />
                {new Date(completedAt).toLocaleDateString()}
              </div>
            )}
            {resource.submittedBy?.image && (
              <img 
                src={resource.submittedBy.image} 
                alt={resource.submittedBy.name || resource.submittedBy.email}
                className="rounded-circle ms-2"
                width={20}
                height={20}
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  )

  const modals = (
    <>
      <ResourceLightbox
        resource={resource}
        show={showEdit}
        onHide={() => setShowEdit(false)}
        onEdit={handleResourceUpdate}
        isFavorite={isFavorite}
        isCompleted={isCompleted}
        onToggleFavorite={onToggleFavorite}
        onToggleComplete={onToggleComplete}
        startInEditMode={true}
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

  if (viewType === 'columns') {
    return (
      <>
        {standalone ? (
          <div className="mb-3">
            {card}
          </div>
        ) : (
          <Draggable draggableId={resource.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="mb-3"
              >
                {card}
              </div>
            )}
          </Draggable>
        )}
        {modals}
      </>
    )
  }

  return (
    <>
      {viewType === 'list' ? listView : card}
      {modals}
    </>
  )
} 