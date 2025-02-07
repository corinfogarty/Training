'use client'

import { useState, useEffect } from 'react'
import { Form, Button, Card, Table, Modal } from 'react-bootstrap'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'
import type { Resource, Category } from '@prisma/client'
import Link from 'next/link'

interface ResourceWithCategory extends Resource {
  category: Category
  submittedBy?: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  } | null
  _count: {
    favoritedBy: number
    completedBy: number
  }
}

export default function AdminResources() {
  const [resources, setResources] = useState<ResourceWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingResource, setEditingResource] = useState<ResourceWithCategory | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    categoryId: '',
    difficulty: 'BEGINNER'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resourcesRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/resources'),
        fetch('/api/categories')
      ])

      if (!resourcesRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [resourcesData, categoriesData] = await Promise.all([
        resourcesRes.json(),
        categoriesRes.json()
      ])

      setResources(resourcesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/resources', {
        method: editingResource ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingResource ? { ...formData, id: editingResource.id } : formData)
      })

      if (!response.ok) throw new Error('Failed to save resource')
      
      setShowModal(false)
      setEditingResource(null)
      setFormData({
        title: '',
        description: '',
        url: '',
        categoryId: '',
        difficulty: 'BEGINNER'
      })
      fetchData()
    } catch (error) {
      console.error('Error saving resource:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete resource')
      
      fetchData()
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  const handleEdit = (resource: ResourceWithCategory) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description || '',
      url: resource.url,
      categoryId: resource.categoryId,
      difficulty: 'BEGINNER'
    })
    setShowModal(true)
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Resources</h1>
          <p className="text-muted mb-0">Manage learning resources</p>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex mb-3">
            <div className="position-relative flex-grow-1">
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3" size={20} />
              <Form.Control
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-5"
              />
            </div>
          </div>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Submitted By</th>
                <th className="text-center">Favorites</th>
                <th className="text-center">Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map(resource => (
                <tr key={resource.id}>
                  <td>
                    <div className="fw-medium">{resource.title}</div>
                  </td>
                  <td>{resource.category.name}</td>
                  <td>
                    {resource.submittedBy && (
                      <div className="d-flex align-items-center">
                        {resource.submittedBy.image ? (
                          <img 
                            src={resource.submittedBy.image} 
                            alt={resource.submittedBy.name || resource.submittedBy.email}
                            className="rounded-circle me-2"
                            width="24" 
                            height="24"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="rounded-circle me-2 bg-secondary d-flex align-items-center justify-content-center text-white"
                            style={{ width: '24px', height: '24px', fontSize: '12px' }}
                          >
                            {resource.submittedBy.name?.[0] || resource.submittedBy.email[0]}
                          </div>
                        )}
                        <span className="small">{resource.submittedBy.name || resource.submittedBy.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    <span className="badge bg-warning text-dark">
                      {resource._count.favoritedBy}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-success">
                      {resource._count.completedBy}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="light"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(resource)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleDelete(resource.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => {
        setShowModal(false)
        setEditingResource(null)
        setFormData({
          title: '',
          description: '',
          url: '',
          categoryId: '',
          difficulty: 'BEGINNER'
        })
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingResource ? 'Edit Resource' : 'Add Resource'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingResource ? 'Save Changes' : 'Add Resource'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
} 