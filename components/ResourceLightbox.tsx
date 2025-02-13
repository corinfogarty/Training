'use client'

import React, { useState, useEffect } from 'react'
import { Resource, Category, ContentType } from '@prisma/client'
import { Modal, Button, Badge, Form } from 'react-bootstrap'
import { ExternalLink, Calendar, Link as LinkIcon, Edit, Star, CheckCircle, List, Link2, FileIcon } from 'lucide-react'
import { StarFill, CheckCircleFill, Pencil, Trash } from 'react-bootstrap-icons'
import { useSession } from 'next-auth/react'
import { Editor } from '@tinymce/tinymce-react'

interface ResourceWithRelations extends Resource {
  category?: Category | null
  submittedBy?: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  } | null
}

interface Props {
  resource: ResourceWithRelations
  show: boolean
  onHide: () => void
  onEdit?: () => void
  onDelete?: () => void
  isFavorite?: boolean
  isCompleted?: boolean
  onToggleFavorite?: (e?: React.MouseEvent) => void | Promise<void>
  onToggleComplete?: (e?: React.MouseEvent) => void | Promise<void>
  startInEditMode?: boolean
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
  onToggleComplete,
  startInEditMode = false
}: Props) {
  const { data: session } = useSession()
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [completeLoading, setCompleteLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(startInEditMode)
  const [currentResource, setCurrentResource] = useState<ResourceWithRelations>(resource)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  useEffect(() => {
    setCurrentResource(resource)
  }, [resource])

  useEffect(() => {
    if (isEditing) {
      fetchCategories()
    }
  }, [isEditing])

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
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onToggleFavorite) return
    setFavoriteLoading(true)
    try {
      await onToggleFavorite(e)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleCompleteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onToggleComplete) return
    setCompleteLoading(true)
    try {
      await onToggleComplete(e)
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
            <img
              src={currentResource.previewImage}
              alt={currentResource.title}
              className="img-fluid rounded shadow-sm"
              style={{
                maxHeight: '400px',
                width: 'auto',
                objectFit: 'contain'
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
                <img 
                  src={currentResource?.previewImage || ''}
                  alt="Preview"
                  className="img-fluid rounded shadow-sm w-100"
                  style={{ 
                    height: '200px',
                    objectFit: 'cover',
                    backgroundColor: '#f8f9fa'
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const img = e.currentTarget
                    img.style.display = 'none'
                  }}
                />
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
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={currentResource?.description || ''}
                onEditorChange={(content: string) => {
                  setCurrentResource(prev => ({ ...prev, description: content }))
                }}
                init={{
                  height: 300,
                  menubar: false,
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
                <div dangerouslySetInnerHTML={{ __html: currentResource.description }} />
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

  return (
    <Modal
      show={show}
      onHide={handleModalHide}
      size="lg"
      centered
      backdrop={isEditing ? "static" : true}
      keyboard={!isEditing}
    >
      <Modal.Header closeButton={!isEditing}>
        <Modal.Title>
          {isEditing ? (
            <Button 
              variant="link" 
              onClick={handleEditCancel}
              className="me-2 p-0 text-secondary"
            >
              ← Back
            </Button>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary">{currentResource?.contentType}</span>
              <span className="badge bg-secondary">{currentResource?.category?.name}</span>
            </div>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {content}
      </Modal.Body>
    </Modal>
  )
} 