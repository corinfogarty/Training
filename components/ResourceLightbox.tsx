'use client'

import React from 'react'
import { Resource, Category } from '@prisma/client'
import { Modal, Button, Badge } from 'react-bootstrap'
import { ExternalLink, Calendar, Link as LinkIcon, Edit, Star, CheckCircle, List, Link2 } from 'lucide-react'
import { useState } from 'react'
import EditResourceModal from './EditResourceModal'

interface Props {
  resource: Resource & {
    category?: Category | null
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
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loadingFavorite, setLoadingFavorite] = useState(false)
  const [loadingComplete, setLoadingComplete] = useState(false)
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
    setShowEditModal(true)
  }

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            {resource.title}
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

          <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
            <Badge bg="primary" className="text-uppercase">
              {resource.contentType}
            </Badge>
            {resource.category && (
              <Badge bg="secondary">
                {resource.category.name}
              </Badge>
            )}
            <div className="d-flex align-items-center gap-2">
              {onToggleFavorite && (
                <Button
                  variant="link"
                  className="d-flex align-items-center p-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(e)
                  }}
                  disabled={loadingFavorite}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  style={{ marginLeft: '4px' }}
                >
                  <Star 
                    size={22} 
                    className={`${isFavorite ? 'text-danger' : 'text-muted'} ${loadingFavorite ? 'opacity-50' : ''}`}
                    fill={isFavorite ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  />
                </Button>
              )}
              {onToggleComplete && (
                <Button
                  variant="link"
                  className="d-flex align-items-center p-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleComplete(e)
                  }}
                  disabled={loadingComplete}
                  title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                >
                  <CheckCircle 
                    size={22} 
                    className={`${isCompleted ? 'text-success' : 'text-muted'} ${loadingComplete ? 'opacity-50' : ''}`}
                    fill={isCompleted ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  />
                </Button>
              )}
            </div>
            <div className="ms-auto d-flex align-items-center gap-2 text-muted">
              <Calendar size={14} />
              <small>Added {new Date(resource.createdAt).toLocaleDateString()}</small>
            </div>
          </div>

          <div className="mb-4">
            <div 
              className="formatted-content bg-light rounded p-3"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>

          {content.courseContent && content.courseContent.length > 0 && (
            <div className="mb-4">
              <h6 className="text-uppercase text-muted mb-3 d-flex align-items-center gap-2">
                <div className="bg-primary rounded-circle p-1">
                  <List size={12} className="text-white" />
                </div>
                Course Content
              </h6>
              <div className="bg-light rounded p-3">
                <ul className="list-unstyled mb-0">
                  {content.courseContent.map((item, index) => (
                    <li key={index} className="mb-2 d-flex align-items-start">
                      <span className="text-primary me-2 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {resource.additionalUrls && resource.additionalUrls.length > 0 && (
            <div className="mb-4">
              <h6 className="text-uppercase text-muted mb-3 d-flex align-items-center gap-2">
                <div className="bg-primary rounded-circle p-1">
                  <Link2 size={12} className="text-white" />
                </div>
                Additional Resources
              </h6>
              <div className="bg-light rounded p-3">
                <ul className="list-unstyled mb-0">
                  {resource.additionalUrls.map((url, index) => (
                    <li key={index} className="mb-2 last:mb-0">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="d-flex align-items-center text-decoration-none p-2 bg-white rounded"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkIcon size={14} className="me-2 text-primary" />
                        <span className="text-break flex-grow-1">{url}</span>
                        <ExternalLink size={14} className="ms-2 text-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="d-flex gap-2 mt-4 border-top pt-4">
            <Button 
              variant="primary" 
              href={resource.url} 
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="d-flex align-items-center"
            >
              <ExternalLink size={16} className="me-2" />
              Open Resource
            </Button>
            {onEdit && (
              <Button 
                variant="outline-secondary" 
                onClick={handleEdit}
                className="d-flex align-items-center"
              >
                <Edit size={16} className="me-2" />
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