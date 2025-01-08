'use client'

import { useState } from 'react'
import { Resource, Category } from '@prisma/client'
import { Card, Button, Dropdown, Modal } from 'react-bootstrap'
import { MoreVertical, Star, CheckCircle, Trash2, Edit, ExternalLink, Calendar } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd'
import EditResourceModal from './EditResourceModal'
import ResourceLightbox from './ResourceLightbox'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
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
}

const DynamicWrapper = ({ children, href, isLink }: { children: React.ReactNode, href?: string, isLink: boolean }) => {
  if (isLink && href) {
    return <Link href={href}>{children}</Link>
  }
  return <div>{children}</div>
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
  standalone = false
}: ResourceCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const previewImage = resource.previewImage

  const handleCardClick = (e: React.MouseEvent) => {
    if (!standalone) {
      e.preventDefault()
      router.push(`/resources/${resource.id}`)
    } else {
      setShowLightbox(true)
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

  if (standalone) {
    return (
      <>
        {card}
        {/* ... modals ... */}
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
            <DynamicWrapper isLink={!standalone} href={`/resources/${resource.id}`}>
              {card}
            </DynamicWrapper>
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
            onClick={() => {
              setDeleting(true)
              fetch(`/api/resources/${resource.id}`, {
                method: 'DELETE'
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to delete resource')
                }
                setShowDeleteConfirm(false)
                onDelete()
              })
              .catch(error => {
                console.error('Error deleting resource:', error)
              })
              .finally(() => setDeleting(false))
            }}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
} 