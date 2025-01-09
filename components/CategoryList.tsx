'use client'

import { useState, useEffect } from 'react'
import type { Session } from 'next-auth'
import type { Category, Resource, User, ResourceOrder } from '@prisma/client'
import ResourceCard from './ResourceCard'
import Debug from './Debug'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { Container, Alert, Row, Col, Image, ButtonGroup, Button } from 'react-bootstrap'
import { Grid, List, Columns } from 'lucide-react'
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
    <div className="bg-dark text-white min-vh-100">
      <div className="py-3">
        <Container fluid className="header-container">
          <Row className="align-items-center mb-4">
            <Col xs="auto">
              <Image 
                src="/logo-ols-2023.png" 
                alt="Logo" 
                className="header-logo"
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
              <AuthButton />
            </Col>
          </Row>
        </Container>

        <div className="container-fluid px-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className={`
              ${viewType === 'grid' ? 'pb-4' : ''}
              ${viewType === 'list' ? 'pb-4' : ''}
              ${viewType === 'columns' ? 'kanban-board d-flex gap-4 overflow-auto pb-4' : ''}
            `}>
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className={`
                    ${viewType === 'grid' ? 'mb-4' : ''}
                    ${viewType === 'list' ? 'mb-4' : ''}
                    ${viewType === 'columns' ? 'kanban-column' : ''}
                  `}
                  style={viewType === 'columns' ? { minWidth: '340px', maxWidth: '340px' } : {}}
                >
                  <div className={`
                    bg-white rounded-3 shadow-sm
                    ${viewType === 'list' ? 'list-view' : ''}
                    ${viewType === 'columns' ? 'h-100 d-flex flex-column' : ''}
                  `}>
                    <div className="p-3 border-bottom category-header">
                      <h3 className="h5 mb-0">{category.name}</h3>
                      {category.description && (
                        <small className="text-muted">{category.description}</small>
                      )}
                    </div>

                    <Droppable droppableId={category.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`
                            p-3
                            ${viewType === 'columns' ? 'flex-grow-1' : ''}
                          `}
                          style={viewType === 'columns' ? { 
                            minHeight: '100px',
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 200px)'
                          } : {}}
                        >
                          <div className={`
                            ${viewType === 'grid' ? 'grid-tiles' : ''}
                            ${viewType === 'list' ? 'list-view table-striped' : ''}
                            ${viewType === 'columns' ? 'd-flex flex-column gap-3' : ''}
                          `}>
                            {filteredResources(category.id).map((resource, index) => (
                              <div 
                                key={resource.id}
                                className={viewType === 'list' ? 'w-100' : ''}
                              >
                                <ResourceCard
                                  resource={resource}
                                  onDelete={fetchData}
                                  index={index}
                                  viewType={viewType}
                                  isFavorite={resource.favoritedBy?.some(u => u.id === session?.user?.id)}
                                  isCompleted={resource.completedBy?.some(u => u.id === session?.user?.id)}
                                  onToggleFavorite={() => handleToggleFavorite(resource.id)}
                                  onToggleComplete={() => handleToggleComplete(resource.id)}
                                />
                              </div>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  )
} 