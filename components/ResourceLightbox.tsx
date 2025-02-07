'use client'

import React from 'react'
import { Resource, Category } from '@prisma/client'
import { Modal, Button, Badge } from 'react-bootstrap'
import { ExternalLink, Calendar, Link as LinkIcon, Edit, Star, CheckCircle, List, Link2 } from 'lucide-react'
import { useState } from 'react'
import EditResourceModal from './EditResourceModal'
import { StarFill, CheckCircleFill, Pencil, Trash } from 'react-bootstrap-icons'

interface Props {
  resource: Resource & {
    category?: Category | null
    submittedBy?: {
      id: string
      name?: string | null
      email: string
      image?: string | null
    } | null
  }
  show: boolean
  onHide: () => void
  onEdit?: () => void
  onDelete?: () => void
  isFavorite?: boolean
  isCompleted?: boolean
  onToggleFavorite?: (e?: React.MouseEvent) => void | Promise<void>
  onToggleComplete?: (e?: React.MouseEvent) => void | Promise<void>
}

interface FormattedContent {
  title: string
  description: string
  courseContent?: string[]
  url?: string
}

export default function ResourceLightbox({
  resource,
  show,
  onHide,
  onEdit,
  onDelete,
  isFavorite = false,
  isCompleted = false,
  onToggleFavorite,
  onToggleComplete
}: Props) {
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [completeLoading, setCompleteLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const previewImage = resource.previewImage

  const getFormattedContent = (): FormattedContent => {
    try {
      return JSON.parse(resource.description)
    } catch {
      return {
        title: resource.title,
        description: resource.description
      }
    }
  }

  const content = getFormattedContent()

  const handleEdit = () => {
    if (!onEdit) return
    setShowEditModal(true)
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    if (!onToggleFavorite) return
    setFavoriteLoading(true)
    try {
      await onToggleFavorite(e)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleCompleteClick = async (e: React.MouseEvent) => {
    if (!onToggleComplete) return
    setCompleteLoading(true)
    try {
      await onToggleComplete(e)
    } finally {
      setCompleteLoading(false)
    }
  }

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary">{resource.contentType}</span>
              <span className="badge bg-secondary">{resource.category?.name}</span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewImage && (
            <div className="text-center mb-4">
              <img
                src={previewImage}
                alt={resource.title}
                className="img-fluid rounded shadow-sm"
                style={{
                  maxHeight: '400px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
          <h4 className="mb-3">{content.title}</h4>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center gap-2 text-muted">
              {resource.submittedBy?.image ? (
                <img
                  src={resource.submittedBy.image}
                  alt={resource.submittedBy.name || 'User'}
                  className="rounded-circle"
                  width={24}
                  height={24}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                  style={{ width: '24px', height: '24px', fontSize: '12px' }}
                >
                  {resource.submittedBy?.name?.[0] || resource.submittedBy?.email[0]}
                </div>
              )}
              Added {new Date(resource.createdAt).toLocaleDateString()}
            </div>
            <div className="ms-auto">
              <Button
                variant="link"
                className={`p-0 me-2 ${favoriteLoading ? 'disabled' : ''}`}
                onClick={handleFavoriteClick}
                disabled={favoriteLoading}
              >
                {isFavorite ? <StarFill className="text-warning" size={20} /> : <Star size={20} />}
              </Button>
              <Button
                variant="link"
                className={`p-0 ${completeLoading ? 'disabled' : ''}`}
                onClick={handleCompleteClick}
                disabled={completeLoading}
              >
                {isCompleted ? <CheckCircleFill className="text-success" size={20} /> : <CheckCircle size={20} />}
              </Button>
            </div>
          </div>
          <div className="mb-4">
            {content.description && (
              <div dangerouslySetInnerHTML={{ __html: content.description }} />
            )}
          </div>
          {content.courseContent && content.courseContent.length > 0 && (
            <div className="mb-4">
              <h5>Course Content</h5>
              <ul className="list-unstyled">
                {content.courseContent.map((item, index) => (
                  <li key={index} className="mb-2">
                    <div className="d-flex align-items-center">
                      <span className="me-2">•</span>
                      {item}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              size="lg"
              className="flex-grow-1"
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Resource
            </Button>
            {onEdit && (
              <Button 
                variant="outline-secondary" 
                size="lg"
                onClick={handleEdit}
                className="d-flex align-items-center gap-2"
              >
                <Pencil size={16} />
                Edit
              </Button>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {onEdit && (
        <EditResourceModal
          resource={resource}
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false)
            onHide()
          }}
          onSave={() => {
            setShowEditModal(false)
            onHide()
            onEdit()
          }}
        />
      )}
    </>
  )
} 