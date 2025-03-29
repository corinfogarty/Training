'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Resource, Category, ContentType } from '@prisma/client'
import { Modal, Button, Badge, Form } from 'react-bootstrap'
import { ExternalLink, Calendar, Link as LinkIcon, Edit, Star, CheckCircle, List, Link2, FileIcon } from 'lucide-react'
import { StarFill, CheckCircleFill, Pencil, Trash } from 'react-bootstrap-icons'
import { useSession } from 'next-auth/react'
import { Editor } from '@tinymce/tinymce-react'
import ResourceEditor from './ResourceEditor'
import { FaHeart, FaRegHeart, FaCheck, FaRegCheckSquare, FaArrowLeft } from 'react-icons/fa'

// Define local resource type that matches the existing implementation
interface ResourceWithRelations extends Resource {
  category?: Category | null
  submittedBy?: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  } | null
  favoritedBy?: { id: string }[]
  completedBy?: { id: string }[]
}

interface ResourceLightboxProps {
  resource: ResourceWithRelations
  show: boolean
  onHide: () => void
  onEdit: () => void
  isFavorite: boolean
  isCompleted: boolean
  onToggleFavorite: () => void
  onToggleComplete: () => void
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
  isFavorite,
  isCompleted,
  onToggleFavorite,
  onToggleComplete,
}: ResourceLightboxProps) {
  const { data: session } = useSession()
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [completeLoading, setCompleteLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentResource, setCurrentResource] = useState<ResourceWithRelations>(resource)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentResource(resource)
    // Reset image loaded state when resource changes
    setImageLoaded(false)
  }, [resource])

  useEffect(() => {
    if (isEditing) {
      fetchCategories()
    }
  }, [isEditing])

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        if (isEditing) {
          setIsEditing(false)
        } else {
          onHide()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [show, onHide, isEditing])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError('Failed to load categories')
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setCurrentResource(resource)
    setIsEditing(false)
  }

  const handleModalHide = () => {
    if (!isEditing) {
      onHide()
      // URL will be handled by the parent component via onHide
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onToggleFavorite) return
    setFavoriteLoading(true)
    try {
      await onToggleFavorite()
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleCompleteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onToggleComplete) return
    setCompleteLoading(true)
    try {
      await onToggleComplete()
    } finally {
      setCompleteLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setCurrentResource(prev => ({ ...prev, previewImage: previewUrl }))
    }
  }

  const handleFetchPreview = async () => {
    if (!currentResource?.url) return;
    
    try {
      setPreviewLoading(true);
      const response = await fetch(`/api/preview?url=${encodeURIComponent(currentResource.url)}`);
      if (!response.ok) throw new Error('Failed to fetch preview');
      const data = await response.json();
      
      const decodedImageUrl = data.image ? decodeURIComponent(data.image.replace(/&amp;/g, '&')) : '';
      
      setCurrentResource(prev => ({
        ...prev,
        previewImage: decodedImageUrl,
        description: data.description || prev.description
      }));
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)

    if (!currentResource?.id) {
      console.error('No resource ID found')
      return
    }

    try {
      let finalPreviewImage = currentResource.previewImage

      // If a file is selected, upload it first
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload preview image')
        }

        const { path } = await uploadResponse.json()
        finalPreviewImage = path
      }

      const response = await fetch(`/api/resources/${currentResource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: currentResource.title,
          description: currentResource.description,
          url: currentResource.url,
          contentType: currentResource.contentType,
          categoryId: currentResource.categoryId,
          previewImage: finalPreviewImage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update resource')
      }

      const updatedResource = await response.json()
      setCurrentResource(updatedResource)
      if (onEdit) onEdit()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating resource:', error)
      setError(error instanceof Error ? error.message : 'Failed to update resource')
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && show && !isEditing) {
      onHide()
    }
  }

  const content = (
    <div className="modal-content">
      <div className="modal-body" style={{ height: 'calc(100vh - 180px)', overflowY: 'auto', padding: '1.5rem' }}>
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}
        
        {!isEditing && currentResource?.previewImage && (
          <div className="text-center mb-4">
            {!imageLoaded && (
              <div 
                className="d-flex justify-content-center align-items-center bg-light rounded" 
                style={{ height: '250px', width: '100%' }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading image...</span>
                </div>
              </div>
            )}
            <img
              src={currentResource.previewImage}
              alt={currentResource.title}
              className={`img-fluid rounded shadow-sm ${imageLoaded ? '' : 'd-none'}`}
              style={{
                maxHeight: '400px',
                width: 'auto',
                objectFit: 'contain'
              }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error('Failed to load image:', currentResource.previewImage);
                setImageLoaded(true); // Still mark as loaded even if error
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {isEditing ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Control
                type="url"
                value={currentResource?.url || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentResource(prev => ({ ...prev, url: e.target.value }))}
                required
                placeholder="Enter URL"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="position-relative">
                <div 
                  className="img-placeholder bg-light rounded d-flex justify-content-center align-items-center"
                  style={{ 
                    height: '200px',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  {previewLoading && (
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading preview...</span>
                    </div>
                  )}
                  {!previewLoading && !currentResource?.previewImage && (
                    <span className="text-muted">No preview image</span>
                  )}
                </div>
                {currentResource?.previewImage && (
                  <img 
                    src={currentResource.previewImage}
                    alt="Preview"
                    className="img-fluid rounded shadow-sm w-100"
                    style={{ 
                      height: '200px',
                      objectFit: 'cover'
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const img = e.currentTarget
                      img.style.display = 'none'
                    }}
                  />
                )}
                <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={handleFetchPreview}
                    disabled={!currentResource?.url || previewLoading}
                    title="Fetch image from URL"
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                  >
                    <LinkIcon size={16} />
                  </Button>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="d-none"
                    id="preview-image-upload"
                    aria-label="Choose preview image file"
                  />
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => document.getElementById('preview-image-upload')?.click()}
                    title="Upload image file"
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                  >
                    <FileIcon size={16} />
                  </Button>
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                value={currentResource?.title || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentResource(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Enter title"
                className="h4 border-0 p-0"
                style={{ fontSize: '1.5rem', fontWeight: 600 }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key"}
                value={currentResource?.description || ''}
                onEditorChange={(content: string) => {
                  setCurrentResource(prev => ({ ...prev, description: content }))
                }}
                init={{
                  height: 300,
                  menubar: false,
                  disabled: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Select
                value={currentResource?.categoryId || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentResource(prev => ({ ...prev, categoryId: e.target.value }))}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Select
                value={currentResource?.contentType || 'Resource'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentResource(prev => ({ ...prev, contentType: e.target.value as ContentType }))}
                required
              >
                <option value="Resource">Resource</option>
                <option value="Training">Training</option>
                <option value="Shortcut">Shortcut</option>
                <option value="Plugin">Plugin</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <div className="d-flex gap-2">
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
          </Form>
        ) : (
          <>
            <h4 className="mb-3">{currentResource?.title || ''}</h4>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="d-flex align-items-center gap-2 text-muted">
                {currentResource?.submittedBy?.image ? (
                  <img
                    src={currentResource.submittedBy.image}
                    alt={currentResource.submittedBy.name || 'User'}
                    className="rounded-circle"
                    width={24}
                    height={24}
                    style={{ objectFit: 'cover' }}
                  />
                ) : currentResource?.submittedBy ? (
                  <div 
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                    style={{ width: '24px', height: '24px', fontSize: '12px' }}
                  >
                    {currentResource.submittedBy.name?.[0] || currentResource.submittedBy.email[0]}
                  </div>
                ) : null}
                Added {currentResource?.createdAt ? new Date(currentResource.createdAt).toLocaleDateString() : ''}
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
              {currentResource?.description && (
                <div dangerouslySetInnerHTML={{ 
                  __html: (() => {
                    try {
                      const content = JSON.parse(currentResource.description);
                      return content.description || '';
                    } catch {
                      return currentResource.description;
                    }
                  })()
                }} />
              )}
            </div>
          </>
        )}
      </div>
      <div className="modal-footer border-top">
        <div className="d-flex gap-2 w-100">
          {isEditing ? (
            <>
              <Button 
                variant="secondary" 
                onClick={handleEditCancel}
                disabled={loading}
                size="lg"
                className="flex-grow-1"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
                disabled={loading}
                size="lg"
                className="flex-grow-1"
                type="submit"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              {currentResource?.url && (
                <Button 
                  variant="primary" 
                  size="lg"
                  className="flex-grow-1"
                  href={currentResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Resource
                </Button>
              )}
              {(session?.user?.isAdmin || session?.user?.id === currentResource?.submittedBy?.id) && (
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
            </>
          )}
        </div>
      </div>
    </div>
  )

  if (isEditing) {
    return (
      <div 
        className={`resource-overlay ${show ? 'resource-overlay-visible' : ''}`}
        ref={overlayRef}
        onClick={handleBackdropClick}
      >
        <div className="resource-content editing-mode">
          <Button 
            variant="link" 
            className="back-button" 
            onClick={() => setIsEditing(false)}
          >
            <FaArrowLeft /> Back to resource
          </Button>
          
          <ResourceEditor 
            resource={currentResource} 
            onSave={() => {
              setIsEditing(false)
              if (onEdit) onEdit()
            }} 
            onCancel={handleEditCancel} 
          />
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`resource-overlay ${show ? 'resource-overlay-visible' : ''}`}
      ref={overlayRef}
      onClick={handleBackdropClick}
    >
      <div className="resource-content">
        <button 
          className="close-button" 
          onClick={handleModalHide}
          aria-label="Close"
        >
          ×
        </button>
        
        <div className="resource-header">
          <h2>{currentResource?.title || ''}</h2>
          
          <div className="resource-actions">
            <Button 
              variant={isFavorite ? "danger" : "outline-danger"} 
              className="action-button" 
              onClick={handleFavoriteClick}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
              {isFavorite ? ' Favorited' : ' Favorite'}
            </Button>
            
            <Button 
              variant={isCompleted ? "success" : "outline-success"} 
              className="action-button" 
              onClick={handleCompleteClick}
            >
              {isCompleted ? <FaCheck /> : <FaRegCheckSquare />}
              {isCompleted ? ' Completed' : ' Mark Complete'}
            </Button>
            
            <Button 
              variant="outline-primary" 
              className="action-button"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
        </div>
        
        {currentResource?.previewImage && (
          <div className="resource-image-container">
            <img
              src={currentResource.previewImage}
              alt={currentResource.title}
              className={imageLoaded ? 'loaded' : ''}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.warn(`Image not found: ${currentResource.previewImage}`);
                const fallbackImage = "/defaults/resource-placeholder.png";
                (e.target as HTMLImageElement).src = fallbackImage;
                (e.target as HTMLImageElement).onerror = () => {
                  (e.target as HTMLImageElement).style.display = 'none';
                };
                setImageLoaded(true);
              }}
            />
            {!imageLoaded && (
              <div className="image-placeholder">
                Loading image...
              </div>
            )}
          </div>
        )}
        
        <div className="resource-description">
          <div dangerouslySetInnerHTML={{ __html: currentResource?.description || '' }} />
        </div>
        
        {currentResource?.url && (
          <div className="resource-footer">
            <a 
              href={currentResource.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
            >
              Visit Resource
            </a>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .resource-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          pointer-events: none;
        }
        
        .resource-overlay-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        
        .resource-content {
          background: white;
          border-radius: 4px;
          max-width: 800px;
          width: 95%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          transform: translateY(20px);
          transition: transform 0.3s ease;
        }
        
        .resource-overlay-visible .resource-content {
          transform: translateY(0);
        }
        
        .editing-mode {
          max-width: 900px;
          width: 98%;
        }
        
        .close-button {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          color: #000;
          opacity: 0.5;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        
        .close-button:hover {
          opacity: 0.75;
        }
        
        .back-button {
          margin-bottom: 15px;
          color: #666;
          padding-left: 0;
        }
        
        .resource-header {
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }
        
        .resource-header h2 {
          margin-bottom: 15px;
          padding-right: 30px;
        }
        
        .resource-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .resource-image-container {
          position: relative;
          margin-bottom: 20px;
          text-align: center;
          min-height: 100px;
        }
        
        .resource-image-container img {
          max-width: 100%;
          max-height: 400px;
          margin: 0 auto;
          display: block;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .resource-image-container img.loaded {
          opacity: 1;
        }
        
        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          background: #f8f9fa;
        }
        
        .resource-description {
          margin-bottom: 20px;
        }
        
        .resource-footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
      `}</style>
    </div>
  )
} 