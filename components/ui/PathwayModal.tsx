'use client'

import { useState, useEffect } from "react"
import { Modal, Form } from "react-bootstrap"
import { Search } from "lucide-react"
import { Resource, Category } from "@prisma/client"

type ResourceWithCategory = Resource & {
  category?: Category | null
}

interface PathwayModalProps {
  show: boolean
  onHide: () => void
  onAdd?: (resourceId: string) => void
}

export default function PathwayModal({ show, onHide, onAdd }: PathwayModalProps) {
  const [resources, setResources] = useState<ResourceWithCategory[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (show) {
      fetchResources()
    }
  }, [show])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources')
      if (!response.ok) throw new Error('Failed to fetch resources')
      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error('Error fetching resources:', error)
    }
  }

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Resource to Pathway</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="p-3 border-bottom">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} />
            </span>
            <Form.Control
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-start-0"
            />
          </div>
        </div>

        <div className="list-group list-group-flush">
          {filteredResources.map(resource => (
            <div key={resource.id} className="list-group-item d-flex justify-content-between align-items-center px-3">
              <div>
                <div className="fw-medium">{resource.title}</div>
                <small className="text-muted">{resource.category?.name}</small>
              </div>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => onAdd?.(resource.id)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  )
} 