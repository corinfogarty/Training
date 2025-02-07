'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Form, Modal, Nav } from 'react-bootstrap'
import { Category, User } from '@prisma/client'
import AdminRoute from '@/components/AdminRoute'
import UserStatsModal from '@/components/UserStatsModal'

interface CategoryWithCount extends Category {
  _count: {
    resources: number
  }
}

interface UserWithCounts extends User {
  _count: {
    submittedResources: number
    favorites: number
    completed: number
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'users'>('categories')
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [users, setUsers] = useState<UserWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserWithCounts | null>(null)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultImage: ''
  })

  useEffect(() => {
    fetchCategories()
    fetchUsers()
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
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

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin })
      })
      if (!response.ok) throw new Error('Failed to update user')
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
    }
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
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'categories'}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            >
              Users
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === 'categories' && (
          <>
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
          </>
        )}

        {activeTab === 'users' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-1">Users</h1>
                <p className="text-muted mb-0">Manage user roles and permissions</p>
              </div>
            </div>

            <Table hover responsive>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Stats</th>
                  <th>Last Login</th>
                  <th>Admin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="align-middle">
                      <div className="d-flex align-items-center">
                        {user.image ? (
                          <img 
                            src={user.image} 
                            alt={user.name || ''} 
                            className="rounded-circle me-2"
                            width="32" 
                            height="32"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="rounded-circle me-2 bg-secondary d-flex align-items-center justify-content-center text-white"
                            style={{ width: '32px', height: '32px' }}
                          >
                            {user.name?.[0] || user.email[0]}
                          </div>
                        )}
                        <span>{user.name || 'No name'}</span>
                      </div>
                    </td>
                    <td className="align-middle">{user.email}</td>
                    <td className="align-middle">
                      <div className="d-flex gap-3">
                        <div 
                          role="button" 
                          onClick={() => {
                            setSelectedUser(user)
                            setShowStatsModal(true)
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <small className="d-block text-muted">Submitted</small>
                          <strong>{user._count.submittedResources}</strong>
                        </div>
                        <div 
                          role="button"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowStatsModal(true)
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <small className="d-block text-muted">Favorites</small>
                          <strong>{user._count.favorites}</strong>
                        </div>
                        <div 
                          role="button"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowStatsModal(true)
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <small className="d-block text-muted">Completed</small>
                          <strong>{user._count.completed}</strong>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="align-middle">
                      <Form.Check
                        type="switch"
                        checked={user.isAdmin}
                        onChange={(e) => toggleAdmin(user.id, e.target.checked)}
                      />
                    </td>
                    <td className="align-middle">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            // TODO: Implement user deletion
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

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

        {selectedUser && (
          <UserStatsModal
            user={selectedUser}
            show={showStatsModal}
            onHide={() => {
              setShowStatsModal(false)
              setSelectedUser(null)
            }}
          />
        )}
      </div>
    </AdminRoute>
  )
} 