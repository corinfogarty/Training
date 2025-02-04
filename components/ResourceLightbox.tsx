'use client'

import React from 'react'
import { Resource, Category } from '@prisma/client'
import { Modal, Button, Badge } from 'react-bootstrap'
import { ExternalLink, Calendar, Clock, Link as LinkIcon, Edit, Star, CheckCircle, List, Key, Link2 } from 'lucide-react'
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
          <Modal.Title className="d-flex align-items-center gap-2">
            {resource.title}
            <Badge bg="secondary" className="ms-2">
              {resource.contentType}
            </Badge>
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

          <div className="d-flex align-items-center gap-3 mb-4">
            <Badge bg="primary" className="text-uppercase">
              {resource.contentType}
            </Badge>
            {resource.category && (
              <Badge bg="secondary">
                {resource.category.name}
              </Badge>
            )}
            <div className="ms-auto d-flex align-items-center gap-2 text-muted">
              <Calendar size={14} />
              <small>Added {new Date(resource.createdAt).toLocaleDateString()}</small>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="text-uppercase text-muted mb-3 d-flex align-items-center gap-2">
              <div className="bg-primary rounded-circle p-1">
                <LinkIcon size={12} className="text-white" />
              </div>
              Main Resource
            </h6>
            <a 
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="d-block p-3 bg-light rounded text-decoration-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex align-items-center gap-2">
                <span className="text-break flex-grow-1">{resource.url}</span>
                <ExternalLink size={14} className="text-muted flex-shrink-0" />
              </div>
            </a>
          </div>

          <div className="mb-4">
            <h6 className="text-uppercase text-muted mb-3">Description</h6>
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

          {content.credentials && (content.credentials.username || content.credentials.password) && (
            <div className="mb-4">
              <h6 className="text-uppercase text-muted mb-3 d-flex align-items-center gap-2">
                <div className="bg-primary rounded-circle p-1">
                  <Key size={12} className="text-white" />
                </div>
                Credentials
              </h6>
              <div className="bg-light rounded p-3">
                {content.credentials.username && (
                  <div className="mb-2">
                    <div className="small text-muted mb-1">Username</div>
                    <code className="p-2 bg-white rounded d-inline-block">{content.credentials.username}</code>
                  </div>
                )}
                {content.credentials.password && (
                  <div>
                    <div className="small text-muted mb-1">Password</div>
                    <code className="p-2 bg-white rounded d-inline-block">{content.credentials.password}</code>
                  </div>
                )}
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
                onClick={() => {
                  onHide()
                  setShowEditModal(true)
                }}
                className="d-flex align-items-center"
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
                variant={isCompleted ? 'success' : 'outline-success'}
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