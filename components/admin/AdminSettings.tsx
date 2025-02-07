'use client'

import { useState, useEffect } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import type { Category } from '@prisma/client'

interface Settings {
  id: number
  siteName: string | null
  defaultCategoryId: string | null
  notificationEmail: string | null
  emailEnabled: boolean
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [settingsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/categories')
      ])

      if (!settingsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [settingsData, categoriesData] = await Promise.all([
        settingsRes.json(),
        categoriesRes.json()
      ])

      setSettings(settingsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (!response.ok) throw new Error('Failed to save settings')
      
      // Refetch to ensure we have the latest data
      fetchData()
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">Failed to load settings</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Settings</h1>
          <p className="text-muted mb-0">Configure site settings</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.siteName || ''}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    placeholder="Enter site name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Default Category</Form.Label>
                  <Form.Select
                    value={settings.defaultCategoryId || ''}
                    onChange={(e) => setSettings({ ...settings, defaultCategoryId: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notification Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={settings.notificationEmail || ''}
                    onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                    placeholder="Enter notification email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Enable Email Notifications"
                    checked={settings.emailEnabled}
                    onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
} 