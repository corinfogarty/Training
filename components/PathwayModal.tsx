'use client'

import { Modal, Button } from 'react-bootstrap'
import { ArrowLeft, Star, CheckCircle, Calendar } from 'lucide-react'
import ResourceCard from './ResourceCard'
import Image from 'next/image'
import { usePathway } from './PathwayContext'
import { useState, useEffect } from 'react'

type Resource = {
  id: string
  title: string
  description: string
  url: string
  additionalUrls: string[]
  previewImage: string | null
  categoryId: string
  createdAt: Date
  updatedAt: Date
  contentType: 'Resource' | 'Training' | 'Shortcut' | 'Plugin'
  submittedById: string | null
  notes?: string
  duration?: string | null
}

type PathwayResource = {
  id: string
  resourceId: string
  order: number
  notes?: string
  resource: Resource
}

type Pathway = {
  id: string
  title: string
  description: string
  createdBy: {
    name: string
    image: string
  }
  resources: PathwayResource[]
}

interface PathwayModalProps {
  show: boolean
  onHide: () => void
  pathways: Pathway[]
}

export default function PathwayModal({ show, onHide, pathways }: PathwayModalProps) {
  const { selectedPathway, setSelectedPathway } = usePathway()
  const [resourceStates, setResourceStates] = useState<Record<string, { isFavorite: boolean, isCompleted: boolean, completedAt?: Date }>>({})

  const handleSelectPathway = (pathway: Pathway) => {
    setSelectedPathway(pathway)
  }

  const handleResourceUpdate = () => {
    // Refetch pathway data when a resource is updated
    // This would need to be implemented based on your data fetching strategy
  }

  useEffect(() => {
    // Fetch resource states when pathway is selected
    if (selectedPathway) {
      selectedPathway.resources.forEach(async (item) => {
        try {
          const response = await fetch(`/api/resources/${item.resource.id}/state`)
          if (response.ok) {
            const state = await response.json()
            setResourceStates(prev => ({
              ...prev,
              [item.resource.id]: state
            }))
          }
        } catch (error) {
          console.error('Error fetching resource state:', error)
        }
      })
    }
  }, [selectedPathway])

  const handleToggleFavorite = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/favorite`, {
        method: 'POST'
      })
      if (response.ok) {
        const data = await response.json()
        setResourceStates(prev => ({
          ...prev,
          [resourceId]: {
            ...prev[resourceId],
            isFavorite: data.isFavorite
          }
        }))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleToggleComplete = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/complete`, {
        method: 'POST'
      })
      if (response.ok) {
        const data = await response.json()
        setResourceStates(prev => ({
          ...prev,
          [resourceId]: {
            ...prev[resourceId],
            isCompleted: data.isCompleted,
            completedAt: data.isCompleted ? new Date() : undefined
          }
        }))
      }
    } catch (error) {
      console.error('Error toggling complete:', error)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" className="resource-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedPathway ? (
            <div className="d-flex align-items-center gap-3">
              <Button 
                variant="link" 
                className="p-0 me-2" 
                onClick={() => setSelectedPathway(null)}
              >
                <ArrowLeft size={20} />
              </Button>
              <div className="d-flex align-items-center">
                <h4 className="mb-0">{selectedPathway.title}</h4>
              </div>
              {selectedPathway.createdBy.image && (
                <Image
                  src={selectedPathway.createdBy.image}
                  alt={selectedPathway.createdBy.name}
                  width={24}
                  height={24}
                  className="rounded-circle"
                />
              )}
            </div>
          ) : (
            <h4 className="mb-0">Learning Pathways</h4>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedPathway ? (
          <>
            <p className="text-muted mb-4">{selectedPathway.description}</p>
            <div className="grid-tiles">
              {selectedPathway.resources.map((item, index) => (
                <div 
                  key={item.id}
                  className="h-100 shadow-sm card"
                  style={{ cursor: 'pointer', position: 'relative', zIndex: 'auto' }}
                  onClick={() => window.open(item.resource.url, '_blank')}
                >
                  <div 
                    className="card-img-top"
                    style={{
                      height: '120px',
                      backgroundImage: item.resource.previewImage ? `url(${item.resource.previewImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                  <div className="p-3 d-flex flex-column card-body">
                    <div className="mb-auto">
                      <h6 className="mb-0 fw-semibold">
                        {item.resource.title}
                        {item.notes && ` | ${item.notes}`}
                      </h6>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          className={`text-muted p-0 ${resourceStates[item.resource.id]?.isFavorite ? 'text-warning' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleFavorite(item.resource.id)
                          }}
                        >
                          <Star 
                            size={16} 
                            fill={resourceStates[item.resource.id]?.isFavorite ? 'currentColor' : 'none'} 
                            className={resourceStates[item.resource.id]?.isFavorite ? 'text-warning' : ''}
                          />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className={`text-muted p-0 ${resourceStates[item.resource.id]?.isCompleted ? 'text-success' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleComplete(item.resource.id)
                          }}
                        >
                          <CheckCircle 
                            size={16} 
                            fill={resourceStates[item.resource.id]?.isCompleted ? 'currentColor' : 'none'} 
                            className={resourceStates[item.resource.id]?.isCompleted ? 'text-success' : ''}
                          />
                        </Button>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {resourceStates[item.resource.id]?.completedAt && (
                          <div className="small text-muted d-flex align-items-center">
                            <Calendar size={12} className="me-1" />
                            {new Date(resourceStates[item.resource.id].completedAt!).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="grid-tiles" style={{ gap: '1.5rem' }}>
            {pathways.map((pathway) => (
              <div 
                key={pathway.id} 
                className="card h-100 cursor-pointer"
                onClick={() => handleSelectPathway(pathway)}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title mb-0">{pathway.title}</h5>
                    {pathway.createdBy.image && (
                      <Image
                        src={pathway.createdBy.image}
                        alt={pathway.createdBy.name}
                        width={24}
                        height={24}
                        className="rounded-circle"
                      />
                    )}
                  </div>
                  <p className="card-text text-muted small">{pathway.description}</p>
                  <div className="mt-2 text-end">
                    <small className="text-muted">
                      {pathway.resources.length} resource{pathway.resources.length === 1 ? '' : 's'}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
} 