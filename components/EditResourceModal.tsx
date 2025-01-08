'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { Resource, ResourceType } from '@prisma/client'
import { Editor } from '@tinymce/tinymce-react'

interface EditResourceModalProps {
  resource: Resource
  show: boolean
  onHide: () => void
  onSave: () => void
}

interface FormattedContent {
  title: string
  description: string
  credentials: {
    username?: string
    password?: string
  }
  courseContent?: string[]
  previewImage?: string
  url?: string
}

export default function EditResourceModal({ resource, show, onHide, onSave }: EditResourceModalProps) {
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState(resource.title)
  const [url, setUrl] = useState(resource.url)
  const [type, setType] = useState(resource.type)
  const [previewImage, setPreviewImage] = useState(resource.previewImage || '')
  const [content, setContent] = useState<FormattedContent>(() => {
    try {
      return JSON.parse(resource.description)
    } catch {
      return {
        title: resource.title,
        description: resource.description,
        credentials: {},
        courseContent: []
      }
    }
  })

  useEffect(() => {
    if (show) {
      setTitle(resource.title)
      setUrl(resource.url)
      setType(resource.type)
      setPreviewImage(resource.previewImage || '')
      try {
        setContent(JSON.parse(resource.description))
      } catch {
        setContent({
          title: resource.title,
          description: resource.description,
          credentials: {},
          courseContent: []
        })
      }
    }
  }, [show, resource])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updatedContent = {
        ...content,
        title,
        previewImage
      }

      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          url,
          type,
          previewImage,
          description: JSON.stringify(updatedContent, null, 2)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update resource')
      }

      onSave()
      onHide()
    } catch (error) {
      console.error('Error updating resource:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
            <Form.Label>Type</Form.Label>
            <Form.Select 
              value={type}
              onChange={(e) => setType(e.target.value as ResourceType)}
              aria-label="Resource type"
            >
              <option value="LINK">Link</option>
              <option value="VIDEO">Video</option>
              <option value="DOCUMENT">Document</option>
              <option value="IMAGE">Image</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={content.description}
              onEditorChange={(newValue) => {
                setContent(prev => ({
                  ...prev,
                  description: newValue
                }))
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
            <Form.Label>Credentials</Form.Label>
            <div className="bg-light rounded p-3">
              <Form.Group className="mb-2">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={content.credentials?.username || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    credentials: {
                      ...prev.credentials,
                      username: e.target.value
                    }
                  }))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  value={content.credentials?.password || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    credentials: {
                      ...prev.credentials,
                      password: e.target.value
                    }
                  }))}
                />
              </Form.Group>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
} 