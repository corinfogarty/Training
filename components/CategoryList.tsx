'use client'

import { useState, useEffect } from 'react'
import type { Session } from 'next-auth'
import type { Category, Resource, User, ResourceOrder } from '@prisma/client'
import ResourceCard from './ResourceCard'
import Debug from './Debug'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { Container, Alert, Row, Col, Image } from 'react-bootstrap'
import CategoryFilter from './CategoryFilter'
import { useSession } from 'next-auth/react'
import AddResourceButton from './AddResourceButton'
import SearchBar from './SearchBar'
import AuthButton from './AuthButton'

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
  const { data: session } = useSession()

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
      fetchData()
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
      fetchData()
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
        <Container>
          <Row className="align-items-center mb-4">
            <Col xs="auto">
              <Image 
                src="/logo-ols-2023.png" 
                alt="Logo" 
                height={40}
              />
            </Col>
            <Col>
              <SearchBar 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
                placeholder="Search resources by title or description..."
              />
            </Col>
            <Col xs="auto" className="d-flex gap-3 align-items-center">
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

        <div className="px-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board d-flex gap-4 overflow-auto pb-4">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="kanban-column"
                  style={{ minWidth: '340px', maxWidth: '340px' }}
                >
                  <div className="bg-white rounded-3 h-100 d-flex flex-column shadow-sm">
                    {category.defaultImage ? (
                      <div 
                        className="rounded-top-3" 
                        style={{ 
                          height: '50px',
                          backgroundImage: `url(${category.defaultImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    ) : (
                      <div className="p-3 border-bottom">
                        <h3 className="h5 mb-1">{category.name}</h3>
                        {category.description && (
                          <small className="text-muted">{category.description}</small>
                        )}
                      </div>
                    )}
                    <Droppable droppableId={category.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="p-3 flex-grow-1"
                          style={{ 
                            minHeight: '100px',
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 200px)'
                          }}
                        >
                          <div className="d-flex flex-column gap-3">
                            {filteredResources(category.id).map((resource, index) => (
                              <ResourceCard
                                key={resource.id}
                                resource={resource}
                                onDelete={fetchData}
                                index={index}
                                isFavorite={resource.favoritedBy?.some(u => u.id === session?.user?.id)}
                                isCompleted={resource.completedBy?.some(u => u.id === session?.user?.id)}
                                onToggleFavorite={() => handleToggleFavorite(resource.id)}
                                onToggleComplete={() => handleToggleComplete(resource.id)}
                              />
                            ))}
                          </div>
                          {provided.placeholder}
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