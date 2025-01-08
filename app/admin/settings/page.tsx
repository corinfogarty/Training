'use client'

import { useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: true,
    maxResourcesPerUser: 100,
    maxCategoriesPerUser: 10
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (!response.ok) throw new Error('Failed to update settings')
      // Show success message
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  return (
    <AdminRoute>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-1">Settings</h1>
            <p className="text-muted mb-0">Configure application settings</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="allowRegistration"
                      label="Allow New Registrations"
                      checked={settings.allowRegistration}
                      onChange={(e) => setSettings(s => ({ ...s, allowRegistration: e.target.checked }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="requireEmailVerification"
                      label="Require Email Verification"
                      checked={settings.requireEmailVerification}
                      onChange={(e) => setSettings(s => ({ ...s, requireEmailVerification: e.target.checked }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Max Resources Per User</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.maxResourcesPerUser}
                      onChange={(e) => setSettings(s => ({ ...s, maxResourcesPerUser: parseInt(e.target.value) }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Max Categories Per User</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.maxCategoriesPerUser}
                      onChange={(e) => setSettings(s => ({ ...s, maxCategoriesPerUser: parseInt(e.target.value) }))}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary">
                    Save Settings
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-6">
            <Card>
              <Card.Body>
                <h5 className="card-title">Database Management</h5>
                <p className="text-muted">Manage database operations</p>
                
                <Button 
                  variant="danger" 
                  className="me-2"
                  onClick={() => {
                    if (window.confirm('Are you sure? This will permanently delete all inactive users.')) {
                      // TODO: Implement cleanup
                    }
                  }}
                >
                  Clean Inactive Users
                </Button>

                <Button 
                  variant="warning"
                  onClick={() => {
                    if (window.confirm('Are you sure? This will reset all user progress.')) {
                      // TODO: Implement reset
                    }
                  }}
                >
                  Reset Progress
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </AdminRoute>
  )
} 