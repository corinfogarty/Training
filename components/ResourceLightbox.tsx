'use client'

import React from 'react'
import { Resource, Category } from '@prisma/client'
import { Modal, Button, Badge } from 'react-bootstrap'
import { ExternalLink, Calendar, Clock, Link as LinkIcon, Edit, Star, CheckCircle } from 'lucide-react'
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
  credentials: {
    username?: string
    password?: string
  }
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
        description: resource.description,
        credentials: {}
      }
    }
  }

  const content = getFormattedContent()

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{resource.title}</Modal.Title>
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
                  width: 'auto'
                }}
              />
            </div>
          )}

          <div className="mb-4">
            <h6 className="text-muted mb-3">Description</h6>
            <div 
              className="formatted-content"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>

          {content.courseContent && content.courseContent.length > 0 && (
            <div className="mb-4">
              <h6 className="text-muted mb-3">Course Content</h6>
              <div className="bg-light rounded p-3">
                <ul className="list-unstyled mb-0">
                  {content.courseContent.map((item, index) => (
                    <li key={index} className="mb-2 d-flex">
                      <span className="text-primary me-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {content.credentials && (content.credentials.username || content.credentials.password) && (
            <div className="mb-4">
              <h6 className="text-muted mb-3">Credentials</h6>
              <div className="bg-light rounded p-3">
                {content.credentials.username && (
                  <div className="mb-2">
                    <strong className="me-2">Username:</strong>
                    <code>{content.credentials.username}</code>
                  </div>
                )}
                {content.credentials.password && (
                  <div>
                    <strong className="me-2">Password:</strong>
                    <code>{content.credentials.password}</code>
                  </div>
                )}
              </div>
            </div>
          )}

          {resource.additionalUrls && resource.additionalUrls.length > 0 && (
            <div className="mb-4">
              <h6 className="text-muted mb-3">Additional Resources</h6>
              <div className="bg-light rounded p-3">
                <ul className="list-unstyled mb-0">
                  {resource.additionalUrls.map((url, index) => (
                    <li key={index} className="mb-2">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="d-flex align-items-center text-decoration-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkIcon size={14} className="me-2 text-primary" />
                        <span className="text-break">{url}</span>
                        <ExternalLink size={14} className="ms-2 text-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="d-flex gap-2 mt-4">
            <Button 
              variant="outline-primary" 
              href={resource.url} 
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} className="me-2" />
              Open Resource
            </Button>
            {onEdit && (
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  onHide()
                  setShowEditModal(true)
                }}
              >
                <Edit size={16} className="me-2" />
                Edit
              </Button>
            )}
            {onToggleFavorite && (
              <Button
                variant={isFavorite ? 'danger' : 'outline-danger'}
                className="d-flex align-items-center"
                onClick={() => {
                  onToggleFavorite()
                }}
                disabled={loadingFavorite}
              >
                <Star 
                  size={16} 
                  className={`me-2 ${loadingFavorite ? 'opacity-50' : ''}`}
                  fill={isFavorite ? 'white' : 'none'}
                />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
            )}
            {onToggleComplete && (
              <Button
                variant={isCompleted ? 'info' : 'outline-info'}
                className="d-flex align-items-center"
                onClick={() => {
                  onToggleComplete()
                }}
                disabled={loadingComplete}
              >
                <CheckCircle 
                  size={16} 
                  className={`me-2 ${loadingComplete ? 'opacity-50' : ''}`}
                  fill={isCompleted ? 'white' : 'none'}
                />
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </Button>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {onEdit && (
        <EditResourceModal
          resource={resource}
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false)
            onEdit()
          }}
        />
      )}
    </>
  )
} 