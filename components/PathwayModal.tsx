'use client'

import { Modal, Button, Form, Badge, ProgressBar } from 'react-bootstrap'
import { ArrowLeft, Star, CheckCircle, Calendar, Plus, Settings, Search, Check, X, Edit, Trash } from 'lucide-react'
import ResourceCard from './ResourceCard'
import Image from 'next/image'
import { usePathway } from './PathwayContext'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Resource, Category } from "@prisma/client"
import { MouseEvent } from 'react'
import ResourceLightbox from './ResourceLightbox'
import { usePathwayProgress } from '@/hooks/usePathwayProgress'

type CreatedBy = {
  id: string
  name: string
  image: string
}

type ResourceWithCategory = Resource & {
  category?: Category | null
  notes?: string
  submittedBy?: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  } | null
}

type PathwayResource = {
  id: string
  resourceId: string
  order: number
  resource: ResourceWithCategory
}

type Pathway = {
  id: string
  title: string
  description: string
  createdBy: CreatedBy
  resources: PathwayResource[]
  isPublished?: boolean
}

interface PathwayModalProps {
  show: boolean
  onHide: () => void
  pathways: Pathway[]
}

interface ResourceCardProps {
  resource: ResourceWithCategory
  index: number
  isFavorite?: boolean
  isCompleted?: boolean
  completedAt?: Date
  onToggleFavorite: () => void
  onToggleComplete: () => void
  standalone?: boolean
}

type PathwayContextType = {
  selectedPathway: Pathway | null
  setSelectedPathway: (pathway: Pathway | null) => void
  showPathwayModal: boolean
  setShowPathwayModal: (show: boolean) => void
}

export default function PathwayModal({ show, onHide, pathways }: PathwayModalProps) {
  const { selectedPathway, setSelectedPathway } = usePathway() as PathwayContextType
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [resources, setResources] = useState<ResourceWithCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [resourceStates, setResourceStates] = useState<Record<string, { isFavorite: boolean, isCompleted: boolean, completedAt?: Date }>>({})
  const [selectedResource, setSelectedResource] = useState<PathwayResource | null>(null)
  const { progressData } = usePathwayProgress()
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchAvailableResources = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/resources')
      if (!response.ok) throw new Error('Failed to fetch resources')
      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error('Error fetching resources:', error)
      setError('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show) {
      fetchAvailableResources()
    }
  }, [show])

  useEffect(() => {
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

  const handleStartEdit = (pathway: Pathway | null = null) => {
    if (pathway) {
      setSelectedPathway(pathway)
    }
    setEditForm({
      title: pathway?.title || '',
      description: pathway?.description || '',
    })
    setIsEditing(true)
    fetchAvailableResources()
  }

  const handleBackToList = () => {
    setIsEditing(false)
    if (!selectedPathway) {
      setSelectedPathway(null)
    }
  }

  const handleSaveEdit = async () => {
    if (!editForm.title || !editForm.description) {
      toast({
        title: 'Error',
        description: 'Title and description are required',
        variant: 'destructive'
      })
      return
    }

    try {
      const endpoint = selectedPathway?.id 
        ? `/api/admin/pathways/${selectedPathway.id}`
        : '/api/admin/pathways'
      
      const method = selectedPathway?.id ? 'PUT' : 'POST'

      const validResources = selectedPathway?.resources.map((resource, index) => ({
        id: resource.resource.id,
        order: index,
        notes: ''
      })) || []

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          resources: validResources,
          isPublished: true
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save pathway')
      }

      const data = await response.json()
      toast({
        title: 'Success',
        description: selectedPathway?.id ? 'Pathway updated successfully' : 'Pathway created successfully',
      })
      
      router.refresh()
      setSelectedPathway(data)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving pathway:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save pathway',
        variant: 'destructive'
      })
    }
  }

  const handleAddResource = async (resourceId: string) => {
    if (!selectedPathway && !editForm.title) {
      toast({
        title: 'Error',
        description: 'Please enter a pathway name first',
        variant: 'destructive'
      })
      return
    }

    try {
      if (!selectedPathway) {
        // If no pathway exists yet, create one first
        const response = await fetch('/api/pathways', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editForm.title,
            description: editForm.description,
            resources: [{ resourceId, order: 0 }]
          }),
        })

        if (!response.ok) throw new Error('Failed to create pathway')

        const newPathway = await response.json()
        setSelectedPathway(newPathway)
        router.refresh()
      } else {
        // Add resource to existing pathway
        const existingOrders = selectedPathway.resources.map(r => r.order)
        const maxOrder = existingOrders.length > 0 ? Math.max(...existingOrders) : -1
        const nextOrder = maxOrder + 1

        const response = await fetch(`/api/pathways/${selectedPathway.id}/resources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceId,
            order: nextOrder
          }),
        })

        if (!response.ok) throw new Error('Failed to add resource')

        const updatedPathway = await response.json()
        setSelectedPathway(updatedPathway)
        router.refresh()
      }
      
      toast({
        title: 'Success',
        description: 'Resource added successfully',
      })
    } catch (error) {
      console.error('Error adding resource:', error)
      toast({
        title: 'Error',
        description: 'Failed to add resource',
        variant: 'destructive'
      })
    }
  }

  const handleRemoveResource = async (resourceId: string) => {
    if (!selectedPathway) {
      return
    }

    try {
      const response = await fetch(`/api/pathways/${selectedPathway.id}/resources/${resourceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove resource')

      const updatedPathway = await response.json()
      setSelectedPathway(updatedPathway)
      router.refresh()
      toast({
        title: 'Success',
        description: 'Resource removed successfully',
      })
    } catch (error) {
      console.error('Error removing resource:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove resource',
        variant: 'destructive'
      })
    }
  }

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

  const handleResourceClick = (resource: PathwayResource) => {
    setSelectedResource(resource)
  }

  const handleNextResource = () => {
    if (!selectedPathway || !selectedResource) return
    const currentIndex = selectedPathway.resources.findIndex(r => r.id === selectedResource.id)
    if (currentIndex < selectedPathway.resources.length - 1) {
      setSelectedResource(selectedPathway.resources[currentIndex + 1])
    }
  }

  const handlePreviousResource = () => {
    if (!selectedPathway || !selectedResource) return
    const currentIndex = selectedPathway.resources.findIndex(r => r.id === selectedResource.id)
    if (currentIndex > 0) {
      setSelectedResource(selectedPathway.resources[currentIndex - 1])
    }
  }

  const getCurrentResourceIndex = () => {
    if (!selectedPathway || !selectedResource) return null
    return selectedPathway.resources.findIndex(r => r.id === selectedResource.id) + 1
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategories = selectedCategories.size === 0 || 
      selectedCategories.has(resource.category?.name || '')

    const matchesSelected = !showSelectedOnly || 
      selectedPathway?.resources.some(r => r.resource.id === resource.id)

    return matchesSearch && matchesCategories && matchesSelected
  })

  const uniqueCategories = Array.from(
    new Set(resources.map(r => r.category?.name).filter((name): name is string => !!name))
  )

  const handleDeletePathway = async (pathwayToDelete?: Pathway) => {
    const pathway = pathwayToDelete || selectedPathway;
    if (!pathway) return;
    
    const confirmDelete = confirm(`Are you sure you want to delete "${pathway.title}" pathway? This action cannot be undone.`);
    if (!confirmDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/pathways/${pathway.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete pathway');
      }

      // Clear state before showing success message
      const pathwayTitle = pathway.title; // Store the title before clearing state
      setSelectedPathway(null);
      setIsEditing(false);
      setIsDeleting(false);
      
      // Show success message
      toast({
        title: 'Pathway Deleted',
        description: `"${pathwayTitle}" has been successfully deleted`,
      });
      
      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error('Error deleting pathway:', error);
      setIsDeleting(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete pathway',
        variant: 'destructive'
      });
    }
  };

  if (!show) return null

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedPathway && !isEditing ? (
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
            <div className="d-flex align-items-center">
              {isEditing && selectedPathway && (
                <Button 
                  variant="link" 
                  className="p-0 me-2" 
                  onClick={handleBackToList}
                >
                  <ArrowLeft size={20} />
                </Button>
              )}
              <h4 className="mb-0">
                {isEditing ? (selectedPathway ? 'Edit Pathway' : 'Create Pathway') : 'Learning Pathways'}
              </h4>
            </div>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0" style={{ height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
        {isEditing ? (
          <div className="p-4">
            <div className="mb-4">
              <div className="mb-3">
                <Label htmlFor="title">Pathway Name</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter pathway name"
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter pathway description"
                />
              </div>
            </div>

            <div className="border rounded">
              <div className="p-3 border-bottom bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Resources</h5>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="flex items-center">
                        <Switch
                          id="showSelected"
                          checked={showSelectedOnly}
                          onCheckedChange={(checked) => setShowSelectedOnly(checked)}
                          className="cursor-pointer"
                        />
                        <Label 
                          htmlFor="showSelected" 
                          className="ml-2 cursor-pointer select-none"
                        >
                          Show Selected Only
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <Search size={16} />
                    </span>
                    <Form.Control
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  {uniqueCategories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategories.has(category) ? "primary" : "outline-primary"}
                      size="sm"
                      className="me-2 mb-2"
                      onClick={() => {
                        const newCategories = new Set(selectedCategories)
                        if (newCategories.has(category)) {
                          newCategories.delete(category)
                        } else {
                          newCategories.add(category)
                        }
                        setSelectedCategories(newCategories)
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                <div className="list-group">
                  {filteredResources.map(resource => {
                    const isSelected = selectedPathway 
                      ? selectedPathway.resources.some(r => r.resourceId === resource.id)
                      : false
                    
                    return (
                      <div
                        key={resource.id}
                        className={`list-group-item ${isSelected ? 'active' : ''}`}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{resource.title}</h6>
                            <small>{resource.category?.name}</small>
                          </div>
                          <Button
                            variant={isSelected ? "danger" : "primary"}
                            size="sm"
                            onClick={() => {
                              if (isSelected) {
                                handleRemoveResource(resource.id)
                              } else {
                                handleAddResource(resource.id)
                              }
                            }}
                          >
                            {isSelected ? (
                              <X size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : selectedPathway ? (
          <div className="p-4">
            {selectedResource ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={() => setSelectedResource(null)}
                  >
                    <ArrowLeft size={20} className="me-2" />
                    Back to Pathway
                  </Button>
                  <div className="d-flex align-items-center gap-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handlePreviousResource}
                      disabled={getCurrentResourceIndex() === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-muted">
                      {getCurrentResourceIndex()} of {selectedPathway.resources.length}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleNextResource}
                      disabled={getCurrentResourceIndex() === selectedPathway.resources.length}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <div className="modal-content border-0">
                  <div className="modal-body" style={{ height: 'calc(100vh - 280px)', overflowY: 'auto', padding: '1.5rem' }}>
                    {selectedResource.resource.previewImage && (
                      <div className="text-center mb-4">
                        <img
                          src={selectedResource.resource.previewImage}
                          alt={selectedResource.resource.title}
                          className="img-fluid rounded shadow-sm"
                          style={{
                            maxHeight: '400px',
                            width: 'auto',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    )}
                    <h4 className="mb-3">{selectedResource.resource.title}</h4>
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="d-flex align-items-center gap-2 text-muted">
                        {selectedResource.resource.submittedBy?.image ? (
                          <img
                            src={selectedResource.resource.submittedBy.image}
                            alt={selectedResource.resource.submittedBy.name || 'User'}
                            className="rounded-circle"
                            width={24}
                            height={24}
                            style={{ objectFit: 'cover' }}
                          />
                        ) : selectedResource.resource.submittedBy ? (
                          <div 
                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                            style={{ width: '24px', height: '24px', fontSize: '12px' }}
                          >
                            {selectedResource.resource.submittedBy.name?.[0] || selectedResource.resource.submittedBy.email[0]}
                          </div>
                        ) : null}
                        Added {selectedResource.resource.createdAt ? new Date(selectedResource.resource.createdAt).toLocaleDateString() : ''}
                      </div>
                      <div className="ms-auto">
                        <Button
                          variant="link"
                          className={`p-0 me-2`}
                          onClick={() => handleToggleFavorite(selectedResource.resource.id)}
                        >
                          <Star 
                            size={20} 
                            fill={resourceStates[selectedResource.resource.id]?.isFavorite ? 'currentColor' : 'none'} 
                            className={resourceStates[selectedResource.resource.id]?.isFavorite ? 'text-warning' : ''}
                          />
                        </Button>
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={() => handleToggleComplete(selectedResource.resource.id)}
                        >
                          <CheckCircle 
                            size={20} 
                            fill={resourceStates[selectedResource.resource.id]?.isCompleted ? 'currentColor' : 'none'} 
                            className={resourceStates[selectedResource.resource.id]?.isCompleted ? 'text-success' : ''}
                          />
                        </Button>
                      </div>
                    </div>
                    <div className="mb-4">
                      {selectedResource.resource.description && (
                        <div dangerouslySetInnerHTML={{ __html: selectedResource.resource.description }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="flex-grow-1 me-3">
                    <p className="text-muted mb-3">{selectedPathway.description}</p>
                    {session?.user && (
                      <div className="mb-3">
                        <ProgressBar 
                          now={progressData[selectedPathway.id]?.progress || 0} 
                          label={`${Math.round(progressData[selectedPathway.id]?.progress || 0)}%`}
                          className="mb-2"
                        />
                        <div className="text-muted small">
                          {progressData[selectedPathway.id]?.completedResources || 0} of {selectedPathway.resources.length} resources completed
                        </div>
                      </div>
                    )}
                  </div>
                  {(session?.user?.isAdmin || session?.user?.id === selectedPathway?.createdBy?.id) && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartEdit(selectedPathway)
                      }}
                    >
                      <Settings size={16} />
                    </Button>
                  )}
                </div>
                <div className="grid-tiles">
                  {selectedPathway.resources.map((item, index) => (
                    <div 
                      key={item.resource.id}
                      className="cursor-pointer transform transition-all duration-200 hover:scale-105"
                    >
                      <ResourceCard
                        resource={item.resource}
                        index={index}
                        isFavorite={resourceStates[item.resource.id]?.isFavorite}
                        isCompleted={resourceStates[item.resource.id]?.isCompleted}
                        completedAt={resourceStates[item.resource.id]?.completedAt}
                        onToggleFavorite={() => handleToggleFavorite(item.resource.id)}
                        onToggleComplete={() => handleToggleComplete(item.resource.id)}
                        onClick={() => handleResourceClick(item)}
                        standalone={false}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid-tiles">
              {pathways.map((pathway) => (
                <div 
                  key={pathway.id} 
                  className="card h-100 cursor-pointer"
                  onClick={() => setSelectedPathway(pathway)}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
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
                    <p className="card-text text-muted small mb-3">{pathway.description}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        {(session?.user?.isAdmin || session?.user?.id === pathway.createdBy?.id) && (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStartEdit(pathway)
                            }}
                          >
                            <Settings size={16} />
                          </Button>
                        )}
                        <small className="text-muted">
                          {pathway.resources.length} resource{pathway.resources.length === 1 ? '' : 's'}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="border-top bg-white" style={{ position: 'sticky', bottom: 0 }}>
        {isEditing ? (
          <>
            <Button 
              variant="outline-danger"
              className="me-auto"
              onClick={() => handleDeletePathway()}
              disabled={isDeleting || !selectedPathway?.id}
            >
              <Trash size={16} className="me-2" />
              {isDeleting ? 'Deleting...' : 'Delete Pathway'}
            </Button>
            <Button variant="secondary" onClick={handleBackToList}>
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleSaveEdit}
              disabled={!editForm.title || !editForm.description}
            >
              {selectedPathway?.id ? 'Save Changes' : 'Create Pathway'}
            </Button>
          </>
        ) : selectedResource ? (
          <div className="d-flex gap-2 w-100">
            {selectedResource.resource.url && (
              <Button 
                variant="primary" 
                size="lg"
                className="flex-grow-1"
                href={selectedResource.resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Resource
              </Button>
            )}
            <Button variant="secondary" onClick={() => setSelectedResource(null)}>
              Close
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-between w-100">
            {!selectedPathway && session?.user?.isAdmin && (
              <Button 
                variant="primary"
                className="d-flex align-items-center gap-2"
                onClick={() => handleStartEdit(null)}
              >
                <Plus size={16} />
                Create Pathway
              </Button>
            )}
            <Button variant="secondary" onClick={() => {
              setSelectedPathway(null)
              setIsEditing(false)
              onHide()
            }}>
              Close
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  )
} 