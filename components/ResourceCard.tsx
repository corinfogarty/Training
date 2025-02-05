'use client'

import { useState } from 'react'
import { Resource, Category } from '@prisma/client'
import { Card, Button, Dropdown, Modal } from 'react-bootstrap'
import { MoreVertical, Star, CheckCircle, Trash2, Edit, ExternalLink, Calendar } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd'
import EditResourceModal from './EditResourceModal'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface ResourceCardProps {
  resource: Resource & {
    category?: Category | null
  }
  index?: number
  isFavorite?: boolean
  isCompleted?: boolean
  completedAt?: Date
  onDelete?: () => void
  onToggleFavorite?: () => void
  onToggleComplete?: () => void
  standalone?: boolean
  viewType?: 'grid' | 'list' | 'columns'
}

export default function ResourceCard({
  resource,
  index = 0,
  isFavorite,
  isCompleted,
  completedAt,
  onDelete = () => {},
  onToggleFavorite = () => {},
  onToggleComplete = () => {},
  standalone = false,
  viewType = 'grid'
}: ResourceCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const previewImage = resource.previewImage

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/?resource=${resource.id}`, { scroll: false })
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

  const card = (
    <Card 
      className="h-100 shadow-sm" 
      onClick={handleCardClick}
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
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start">
          <h6 className="mb-0 fw-semibold">{resource.title}</h6>
          <Dropdown 
            onClick={e => e.stopPropagation()}
            onToggle={(isOpen) => setDropdownOpen(isOpen)}
          >
            <Dropdown.Toggle variant="link" className="p-0 text-muted">
              <MoreVertical size={16} />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" style={{ zIndex: 1000 }}>
              <Dropdown.Item onClick={onToggleFavorite}>
                <Star size={16} className="me-2" />
                {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
              </Dropdown.Item>
              <Dropdown.Item onClick={onToggleComplete}>
                <CheckCircle size={16} className="me-2" />
                {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowEdit(true)}>
                <Edit size={16} className="me-2" />
                Edit
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-danger"
              >
                <Trash2 size={16} className="me-2" />
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="d-flex align-items-center gap-2 mt-2">
          {isFavorite && (
            <Star size={16} className="text-warning" fill="currentColor" />
          )}
          {isCompleted && (
            <>
              <CheckCircle size={16} className="text-success" fill="currentColor" />
              {completedAt && (
                <div className="small text-muted d-flex align-items-center">
                  <Calendar size={12} className="me-1" />
                  {new Date(completedAt).toLocaleDateString()}
                </div>
              )}
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  )

  const listView = (
    <div 
      className="resource-list-item"
      onClick={handleCardClick}
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
          <Button
            variant="link"
            size="sm"
            className="text-muted p-0"
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={16} />
          </Button>
          <Dropdown onClick={e => e.stopPropagation()}>
            <Dropdown.Toggle variant="link" className="p-0 text-muted">
              <MoreVertical size={16} />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => setShowEdit(true)}>
                <Edit size={16} className="me-2" />
                Edit
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-danger"
              >
                <Trash2 size={16} className="me-2" />
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  )

  const modals = (
    <>
      <EditResourceModal
        resource={resource}
        show={showEdit}
        onHide={() => setShowEdit(false)}
        onSave={onDelete}
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

  if (standalone) {
    return (
      <>
        {viewType === 'list' ? listView : card}
        {modals}
      </>
    )
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
          >
            {viewType === 'list' ? listView : card}
          </div>
        )}
      </Draggable>
      {modals}
    </>
  )
} 