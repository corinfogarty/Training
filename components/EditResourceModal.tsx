'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { ContentType } from '@prisma/client'
import { Editor } from '@tinymce/tinymce-react'
import type { Resource, Category } from '@/types/prisma'

interface EditResourceModalProps {
  resource: Resource & {
    category?: Category | null
  }
  show: boolean
  onHide: () => void
  onSave: (updatedResource: Resource & { category?: Category | null }) => void
  isInline?: boolean
}

export default function EditResourceModal({ resource, show, onHide, onSave, isInline = false }: EditResourceModalProps) {
  const [currentResource, setCurrentResource] = useState<Resource & { category?: Category | null }>(resource)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  useEffect(() => {
    if (show) {
      setCurrentResource(resource)
      fetchCategories()
    }
  }, [show, resource])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setError(null)
    setSuccess(null)
    setLoading(true)

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
      setSuccess('Resource saved successfully!')
      onSave(updatedResource)
      
      setTimeout(() => {
        setSuccess(null)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
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
    if (!currentResource.url) return;
    
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

  const content = (
    <div className="modal-dialog modal-lg" style={{ margin: 0, maxWidth: '100%', height: 'calc(100vh - 130px)' }}>
      <div className="modal-content h-100">
        <div className="modal-body" style={{ height: 'calc(100vh - 180px)', overflowY: 'auto', padding: '1.5rem' }}>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-3">
              {success}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={currentResource.title}
                onChange={(e) => setCurrentResource(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={currentResource.description}
                onEditorChange={(content) => {
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

            <Form.Group className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="url"
                value={currentResource.url}
                onChange={(e) => setCurrentResource(prev => ({ ...prev, url: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content Type</Form.Label>
              <Form.Select
                value={currentResource.contentType}
                onChange={(e) => setCurrentResource(prev => ({ ...prev, contentType: e.target.value as ContentType }))}
                required
              >
                <option value="Resource">Resource</option>
                <option value="Training">Training</option>
                <option value="Shortcut">Shortcut</option>
                <option value="Plugin">Plugin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={currentResource.categoryId}
                onChange={(e) => setCurrentResource(prev => ({ ...prev, categoryId: e.target.value }))}
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preview Image</Form.Label>
              <div className="d-flex gap-3 align-items-start">
                <div className="flex-grow-1">
                  <Form.Control
                    type="text"
                    value={currentResource.previewImage || ''}
                    onChange={(e) => setCurrentResource(prev => ({ ...prev, previewImage: e.target.value }))}
                    placeholder="Enter image URL or /assets/previews/... path"
                  />
                  <Form.Text className="text-muted">
                    Enter a URL or use the file selector to upload an image
                  </Form.Text>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={handleFetchPreview}
                    disabled={!currentResource.url || previewLoading}
                  >
                    Fetch from URL
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
                    variant="outline-secondary"
                    onClick={() => document.getElementById('preview-image-upload')?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
              {currentResource.previewImage && (
                <div className="mt-2">
                  <img 
                    src={currentResource.previewImage}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px' }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      img.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </div>
        <div className="modal-footer border-top">
          <div className="d-flex gap-2 w-100">
            <Button 
              variant="secondary" 
              onClick={onHide}
              disabled={loading}
              size="lg"
              className="flex-grow-1"
              type="button"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              disabled={loading}
              size="lg"
              className="flex-grow-1"
              onClick={handleSubmit}
              type="button"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (isInline) {
    return content
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>Edit Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {content}
      </Modal.Body>
    </Modal>
  )
} 