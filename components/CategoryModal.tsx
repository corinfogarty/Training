'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { Category } from '@prisma/client'

interface CategoryModalProps {
  show: boolean
  onHide: () => void
  category: Category | null
  onSave: () => void
}

export default function CategoryModal({ show, onHide, category, onSave }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultImage: ''
  })

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        defaultImage: category.defaultImage || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        defaultImage: ''
      })
    }
  }, [category, show])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (category) {
        // Update existing category
        const res = await fetch(`/api/categories/${category.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })

        if (!res.ok) throw new Error('Failed to update category')
      } else {
        // Create new category
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })

        if (!res.ok) throw new Error('Failed to create category')
      }

      onSave()
      onHide()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {category ? 'Edit Category' : 'New Category'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Category name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Category description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Default Image URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.defaultImage}
              onChange={(e) => setFormData({ ...formData, defaultImage: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {category ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
} 