import { Modal, Button, Nav } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Category, User } from '@prisma/client'

interface AdminModalProps {
  show: boolean
  onHide: () => void
}

type AdminView = 'categories' | 'users' | 'settings'

export default function AdminModal({ show, onHide }: AdminModalProps) {
  const [activeView, setActiveView] = useState<AdminView>('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (show) {
      fetchData()
    }
  }, [show])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, usersRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/users')
      ])

      if (!categoriesRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [categoriesData, usersData] = await Promise.all([
        categoriesRes.json(),
        usersRes.json()
      ])

      setCategories(categoriesData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>Admin Dashboard</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0" style={{ height: '80vh' }}>
        <div className="d-flex h-100">
          <div className="bg-light border-end" style={{ width: '200px' }}>
            <Nav className="flex-column p-3" variant="pills">
              <Nav.Item>
                <Nav.Link 
                  active={activeView === 'categories'}
                  onClick={() => setActiveView('categories')}
                  className="mb-2"
                >
                  Categories
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeView === 'users'}
                  onClick={() => setActiveView('users')}
                  className="mb-2"
                >
                  Users
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeView === 'settings'}
                  onClick={() => setActiveView('settings')}
                >
                  Settings
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          
          <div className="flex-grow-1 p-4">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {activeView === 'categories' && (
                  <div>
                    <h2 className="h4 mb-4">Categories</h2>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Resources</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(category => (
                            <tr key={category.id}>
                              <td>{category.name}</td>
                              <td>{category.description}</td>
                              <td>0</td>
                              <td>
                                <Button size="sm" variant="outline-primary" className="me-2">Edit</Button>
                                <Button size="sm" variant="outline-danger">Delete</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {activeView === 'users' && (
                  <div>
                    <h2 className="h4 mb-4">Users</h2>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                              <td>
                                <Button size="sm" variant="outline-primary" className="me-2">Edit</Button>
                                <Button size="sm" variant="outline-danger">Delete</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {activeView === 'settings' && (
                  <div>
                    <h2 className="h4 mb-4">Settings</h2>
                    <p>Settings configuration coming soon...</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
} 