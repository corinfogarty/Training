'use client'

import { useState, useEffect } from 'react'
import { ResourceType, Category } from '@prisma/client'
import { Button, Modal, Form, Alert } from 'react-bootstrap'
import { Editor } from '@tinymce/tinymce-react'

interface AddResourceButtonProps {
  categoryId?: string
  onResourceAdded?: () => void
}

export default function AddResourceButton({ categoryId, onResourceAdded }: AddResourceButtonProps) {
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [previewImage, setPreviewImage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: '' as ResourceType | '',
    categoryId: categoryId || ''
  })

  useEffect(() => {
    if (show) {
      fetchCategories()
    }
  }, [show])

  useEffect(() => {
    if (formData.url) {
      fetchUrlPreview(formData.url)
    }
  }, [formData.url])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
      if (categoryId) {
        const category = data.find((c: Category) => c.id === categoryId)
        setSelectedCategory(category || null)
      }
    } catch (err) {
      setError('Failed to load categories')
    }
  }

  const fetchUrlPreview = async (url: string) => {
    try {
      const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`)
      if (!response.ok) return
      const data = await response.json()
      if (data.image) {
        setPreviewImage(data.image)
      }
    } catch (err) {
      console.error('Error fetching preview:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const content = {
        title: formData.title,
        description: formData.description,
        credentials: {},
        courseContent: []
      }

      const data = {
        title: formData.title,
        description: JSON.stringify(content),
        url: formData.url,
        type: formData.type as ResourceType,
        categoryId: formData.categoryId,
        previewImage: previewImage || selectedCategory?.defaultImage || ''
      }

      if (!data.title || !data.description || !data.url || !data.type || !data.categoryId) {
        throw new Error('All fields are required')
      }

      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add resource')
      }

      setShow(false)
      if (onResourceAdded) {
        onResourceAdded()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId }))
    const category = categories.find(c => c.id === categoryId)
    setSelectedCategory(category || null)
  }

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Add Resource
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Resource</Modal.Title>
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
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Enter title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="description">Description</Form.Label>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={formData.description}
                onEditorChange={(content) => {
                  setFormData(prev => ({ ...prev, description: content }))
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
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required
                placeholder="Enter URL"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preview Image URL</Form.Label>
              <Form.Control
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

            <Form.Group className="mb-3">
              <Form.Label htmlFor="resourceType">Resource Type</Form.Label>
              <Form.Select 
                id="resourceType"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ResourceType }))}
                required
                aria-label="Resource type"
                title="Select resource type"
              >
                <option value="">Select a type</option>
                {Object.values(ResourceType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {!categoryId && (
              <Form.Group className="mb-3">
                <Form.Label htmlFor="categoryId">Category</Form.Label>
                <Form.Select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                  aria-label="Category"
                  title="Select category"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setShow(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}