'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { Resource, Category, ContentType } from '@prisma/client'
import { Editor } from '@tinymce/tinymce-react'

interface EditResourceModalProps {
  resource: Resource & {
    category?: Category | null
  }
  show: boolean
  onHide: () => void
  onSave: () => void
}

export default function EditResourceModal({ resource, show, onHide, onSave }: EditResourceModalProps) {
  const [title, setTitle] = useState(resource.title)
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState(resource.url)
  const [contentType, setContentType] = useState(resource.contentType)
  const [categoryId, setCategoryId] = useState(resource.categoryId)
  const [categories, setCategories] = useState<Category[]>([])
  const [previewImage, setPreviewImage] = useState(resource.previewImage || '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (show) {
      setTitle(resource.title)
      setUrl(resource.url)
      setContentType(resource.contentType)
      setCategoryId(resource.categoryId)
      setPreviewImage(resource.previewImage || '')
      fetchCategories()
      
      try {
        const content = JSON.parse(resource.description)
        setDescription(content.description)
      } catch {
        setDescription(resource.description)
      }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const content = {
        title,
        description,
        credentials: {},
        courseContent: []
      }

      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description: JSON.stringify(content),
          url,
          contentType,
          categoryId,
          previewImage
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update resource')
      }

      onHide()
      onSave()
    } catch (err) {
      console.error('Error updating resource:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Control
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="description">Description</Form.Label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={description}
              onEditorChange={(content) => {
                setDescription(content)
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
            <Form.Label htmlFor="url">URL</Form.Label>
            <Form.Control
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="contentType">Content Type</Form.Label>
            <Form.Select
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              required
              aria-label="Content type"
              title="Select content type"
            >
              <option value="Resource">Resource</option>
              <option value="Training">Training</option>
              <option value="Shortcut">Shortcut</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="categoryId">Category</Form.Label>
            <Form.Select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              aria-label="Category"
              title="Select category"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="previewImage">Preview Image URL</Form.Label>
            <Form.Control
              id="previewImage"
              type="url"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              placeholder="Enter image URL or /assets/... path"
            />
            {previewImage && (
              <div className="mt-2">
                <img 
                  src={previewImage} 
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="secondary" 
              onClick={onHide}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
} 