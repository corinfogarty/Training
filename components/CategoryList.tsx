'use client'

import { useState, useEffect } from 'react'
import type { Session } from 'next-auth'
import type { Category, Resource, User, ResourceOrder } from '@prisma/client'
import ResourceCard from './ResourceCard'
import Debug from './Debug'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { Container, Alert, Row, Col, Image, ButtonGroup, Button, Modal } from 'react-bootstrap'
import { Grid, List, Columns } from 'lucide-react'
import { Chrome } from 'lucide-react'
import CategoryFilter from './CategoryFilter'
import { useSession } from 'next-auth/react'
import AddResourceButton from './AddResourceButton'
import SearchBar from './SearchBar'
import AuthButton from './AuthButton'
import Cookies from 'js-cookie'

type ViewType = 'grid' | 'list' | 'columns'
type FilterType = 'all' | 'favorites' | 'completed' | 'incomplete'
type ActiveFilters = Set<Exclude<FilterType, 'all'>>

interface ResourceWithRelations extends Resource {
  favoritedBy: User[]
  completedBy: User[]
  orders?: ResourceOrder[]
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [resources, setResources] = useState<ResourceWithRelations[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [viewType, setViewType] = useState<ViewType>(() => {
    const savedView = Cookies.get('preferredView')
    return (savedView as ViewType) || 'grid'
  })
  const { data: session } = useSession()
  const [showInstallHelp, setShowInstallHelp] = useState(false)

  // Save view preference when it changes
  useEffect(() => {
    Cookies.set('preferredView', viewType, { expires: 365 })
  }, [viewType])

  useEffect(() => {
    fetchData()
  }, [])

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !session?.user) return

    const { source, destination, draggableId } = result

    try {
      // Get resources in the destination category
      const destinationResources = resources
        .filter(r => r.categoryId === destination.droppableId)
        .sort((a, b) => {
          const aOrder = a.orders?.find(o => o.userId === session.user?.id)?.order ?? 0
          const bOrder = b.orders?.find(o => o.userId === session.user?.id)?.order ?? 0
          return aOrder - bOrder
        })

      // Calculate new order
      let newOrder: number
      if (destination.index === 0) {
        newOrder = (destinationResources[0]?.orders?.find(o => o.userId === session.user?.id)?.order ?? 1000) / 2
      } else if (destination.index >= destinationResources.length) {
        newOrder = ((destinationResources[destinationResources.length - 1]?.orders?.find(o => o.userId === session.user?.id)?.order ?? 1000) + 1000)
      } else {
        const before = destinationResources[destination.index - 1]?.orders?.find(o => o.userId === session.user?.id)?.order ?? 0
        const after = destinationResources[destination.index]?.orders?.find(o => o.userId === session.user?.id)?.order ?? 1000
        newOrder = (before + after) / 2
      }

      // Update the resource position
      const response = await fetch(`/api/resources/${draggableId}/position`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categoryId: destination.droppableId,
          order: newOrder
        })
      })

      if (!response.ok) throw new Error('Failed to update resource position')

      // Refetch data to get updated orders
      fetchData()
    } catch (err) {
      console.error('Failed to update resource position:', err)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, resourcesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/resources')
      ])

      if (!categoriesRes.ok || !resourcesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [categoriesData, resourcesData] = await Promise.all([
        categoriesRes.json(),
        resourcesRes.json()
      ])

      setCategories(categoriesData)
      setResources(resourcesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (resourceId: string) => {
    if (!session?.user) return
    try {
      const response = await fetch(`/api/resources/${resourceId}/favorite`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to toggle favorite')
      
      // Update state locally
      setResources(prevResources => 
        prevResources.map(resource => {
          if (resource.id === resourceId) {
            const isFavorited = resource.favoritedBy.some(u => u.id === session.user?.id)
            return {
              ...resource,
              favoritedBy: isFavorited
                ? resource.favoritedBy.filter(u => u.id !== session.user?.id)
                : [...resource.favoritedBy, { id: session.user?.id } as User]
            }
          }
          return resource
        })
      )
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleToggleComplete = async (resourceId: string) => {
    if (!session?.user) return
    try {
      const response = await fetch(`/api/resources/${resourceId}/complete`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to toggle complete')
      const data = await response.json()
      
      // Update state locally
      setResources(prevResources => 
        prevResources.map(resource => {
          if (resource.id === resourceId) {
            const isCompleted = resource.completedBy.some(u => u.id === session.user?.id)
            return {
              ...resource,
              completedBy: isCompleted
                ? resource.completedBy.filter(u => u.id !== session.user?.id)
                : [...resource.completedBy, { id: session.user?.id } as User]
            }
          }
          return resource
        })
      )
    } catch (error) {
      console.error('Error toggling complete:', error)
    }
  }

  const filteredResources = (categoryId: string) => {
    return resources
      .filter(resource => {
        const matchesSearch = searchTerm === '' || 
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (resource.description?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())

        const matchesCategory = resource.categoryId === categoryId

        // If no filters are active, show all resources
        if (activeFilters.size === 0) return matchesSearch && matchesCategory

        // Check if resource matches any active filters
        const isFavorite = resource.favoritedBy.some(u => u.id === session?.user?.id)
        const isCompleted = resource.completedBy.some(u => u.id === session?.user?.id)

        const matchesFilters = (
          (activeFilters.has('favorites') && isFavorite) ||
          (activeFilters.has('completed') && isCompleted) ||
          (activeFilters.has('incomplete') && !isCompleted)
        )

        return matchesSearch && matchesCategory && matchesFilters
      })
      .sort((a, b) => {
        const aOrder = a.orders?.find(o => o.userId === session?.user?.id)?.order ?? 0
        const bOrder = b.orders?.find(o => o.userId === session?.user?.id)?.order ?? 0
        return aOrder - bOrder
      })
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

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error loading data</Alert.Heading>
        <p>{error}</p>
      </Alert>
    )
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="py-3">
        <Container fluid className="header-container">
          <Row className="align-items-center mb-4">
            <Col xs="auto">
              <Image 
                src="/logo-ols-2023.png" 
                alt="Logo" 
                className="header-logo"
                width={40}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </Col>
            <Col className="header-search">
              <SearchBar 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
                placeholder="Search resources by title or description..."
              />
            </Col>
            <Col xs="auto" className="d-flex gap-3 align-items-center">
              <ButtonGroup>
                <Button 
                  variant={viewType === 'grid' ? 'primary' : 'light'}
                  onClick={() => setViewType('grid')}
                  title="Grid view"
                >
                  <Grid size={16} />
                </Button>
                <Button 
                  variant={viewType === 'list' ? 'primary' : 'light'}
                  onClick={() => setViewType('list')}
                  title="List view"
                >
                  <List size={16} />
                </Button>
                <Button 
                  variant={viewType === 'columns' ? 'primary' : 'light'}
                  onClick={() => setViewType('columns')}
                  title="Columns view"
                >
                  <Columns size={16} />
                </Button>
              </ButtonGroup>
              <CategoryFilter 
                activeFilters={activeFilters} 
                onFilterChange={(filter: Exclude<FilterType, 'all'>) => {
                  setActiveFilters(prev => {
                    const newFilters = new Set(prev)
                    if (newFilters.has(filter)) {
                      newFilters.delete(filter)
                    } else {
                      newFilters.add(filter)
                    }
                    return newFilters
                  })
                }} 
              />
              <AddResourceButton />
              <Button
                variant="outline-secondary"
                onClick={() => setShowInstallHelp(true)}
                title="Extension Installation Help"
              >
                <Chrome size={16} />
              </Button>
              <AuthButton />
            </Col>
          </Row>
        </Container>

        <div className="container-fluid px-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="mt-4">
              {viewType === 'columns' ? (
                <div className="d-flex justify-content-center">
                  <div 
                    className="d-flex gap-4" 
                    style={{ 
                      overflowX: 'auto',
                      paddingBottom: '1rem'
                    }}
                  >
                    {categories.map(category => (
                      <div 
                        key={category.id} 
                        className="bg-white rounded-3 shadow-sm text-dark"
                        style={{ 
                          minWidth: '350px',
                          maxWidth: '350px'
                        }}
                      >
                        <div className="p-3 border-bottom bg-light">
                          <h3 className="h5 mb-0 d-flex justify-content-between align-items-center">
                            <span>{category.name}</span>
                            <small className="text-muted">
                              {filteredResources(category.id).length} resources
                            </small>
                          </h3>
                          {category.description && (
                            <small className="text-muted">{category.description}</small>
                          )}
                        </div>
                        <Droppable droppableId={category.id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="p-3"
                              style={{ 
                                minHeight: '100px',
                                overflowY: 'auto',
                                maxHeight: 'calc(100vh - 300px)'
                              }}
                            >
                              <div className="d-flex flex-column gap-3">
                                {filteredResources(category.id).map((resource, index) => (
                                  <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    onDelete={fetchData}
                                    index={index}
                                    viewType={viewType}
                                    isFavorite={resource.favoritedBy?.some(u => u.id === session?.user?.id)}
                                    isCompleted={resource.completedBy?.some(u => u.id === session?.user?.id)}
                                    onToggleFavorite={() => handleToggleFavorite(resource.id)}
                                    onToggleComplete={() => handleToggleComplete(resource.id)}
                                  />
                                ))}
                                {provided.placeholder}
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="container-fluid px-4">
                  <div className={viewType === 'grid' ? 'grid-tiles' : ''}>
                    {categories.map((category) => (
                      <div key={category.id} className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div>
                            <h3 className="h5 mb-0 d-flex align-items-center gap-2">
                              {category.name}
                              <small className="text-muted">
                                {filteredResources(category.id).length} resources
                              </small>
                            </h3>
                            {category.description && (
                              <small className="text-muted">{category.description}</small>
                            )}
                          </div>
                        </div>
                        <Droppable droppableId={category.id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={viewType === 'list' ? 'list-view' : 'droppable-container'}
                              style={viewType === 'grid' ? { display: 'flex', flexWrap: 'wrap', gap: '1.5rem' } : undefined}
                            >
                              {filteredResources(category.id).map((resource, index) => (
                                <ResourceCard
                                  key={resource.id}
                                  resource={resource}
                                  onDelete={fetchData}
                                  index={index}
                                  viewType={viewType}
                                  isFavorite={resource.favoritedBy?.some(u => u.id === session?.user?.id)}
                                  isCompleted={resource.completedBy?.some(u => u.id === session?.user?.id)}
                                  onToggleFavorite={() => handleToggleFavorite(resource.id)}
                                  onToggleComplete={() => handleToggleComplete(resource.id)}
                                />
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DragDropContext>
        </div>
      </div>

      <Modal show={showInstallHelp} onHide={() => setShowInstallHelp(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Install Chrome Extension (Developer Mode)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ol className="mb-4">
            <li className="mb-2">Download the extension ZIP file from <a href="/extension.zip" className="text-primary">here</a></li>
            <li className="mb-2">Unzip the file to a location on your computer</li>
            <li className="mb-2">Open Chrome and go to <code>chrome://extensions</code></li>
            <li className="mb-2">Enable "Developer mode" using the toggle in the top right</li>
            <li className="mb-2">Click "Load unpacked" button in the top left</li>
            <li className="mb-2">Select the unzipped extension folder</li>
            <li>The extension should now appear in your Chrome toolbar</li>
          </ol>
          <Alert variant="info">
            <Alert.Heading>Note</Alert.Heading>
            <p className="mb-0">This is a temporary installation method while we await approval from the Chrome Web Store. Once approved, you'll be able to install directly from the store.</p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInstallHelp(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
} 