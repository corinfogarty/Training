'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Form, Modal } from 'react-bootstrap'
import { Category } from '@prisma/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'

interface CategoryWithCount extends Category {
  _count: {
    resources: number
  }
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultImage: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to save category')
      
      fetchCategories()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete category')
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '', defaultImage: '' })
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      defaultImage: category.defaultImage || ''
    })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <AdminRoute>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-1">Categories</h1>
            <p className="text-muted mb-0">Manage training categories</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            Add Category
          </Button>
        </div>

        <Table hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Resources</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category._count.resources} resources</td>
                <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Default Image URL</Form.Label>
                <Form.Control
                  type="url"
                  value={formData.defaultImage}
                  onChange={(e) => setFormData({ ...formData, defaultImage: e.target.value })}
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingCategory ? 'Save Changes' : 'Add Category'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </AdminRoute>
  )
} 