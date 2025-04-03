'use client'

import { useState, useEffect } from 'react'
import type { Session } from 'next-auth'
import type { Category, Resource, User, ResourceOrder, ContentType } from '@prisma/client'
import ResourceCard from './ResourceCard'
import Debug from './Debug'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { Container, Alert, Row, Col, Image, ButtonGroup, Button, Modal, Dropdown } from 'react-bootstrap'
import { Grid3x3GapFill as Grid, ListUl as List, Columns, BarChartFill as BarChart, Gear as Settings, People as Users, Grid3x3 as LayoutGrid, Sliders, Book, Star, CheckCircle, XCircle, Command, Puzzle } from 'react-bootstrap-icons'
import { Chrome, GraduationCap } from 'lucide-react'
import CategoryFilter from './CategoryFilter'
import { useSession } from 'next-auth/react'
import AddResourceButton from './AddResourceButton'
import SearchBar from './SearchBar'
import AuthButton from './AuthButton'
import Cookies from 'js-cookie'
import FilterFlyout from './FilterFlyout'
import AdminModal from './AdminModal'
import Link from 'next/link'
import { usePathway } from './PathwayContext'
import PathwayModal from './PathwayModal'
import { useRouter, usePathname } from 'next/navigation'

type ViewType = 'grid' | 'list' | 'columns'
type FilterType = 'all' | 'favorites' | 'completed' | 'incomplete'
type ActiveFilters = Set<Exclude<FilterType, 'all'>>
type ContentTypeFilter = Set<ContentType>
type CategoryFilter = Set<string> // category IDs
type SortType = 'title' | 'date' | 'progress' | 'custom'

interface ResourceWithRelations extends Resource {
  favoritedBy: User[]
  completedBy: User[]
  orders?: ResourceOrder[]
}

interface CategoryListProps {
  resourceId?: string | null
  onResourceClick?: (id: string) => void
  onResourceHover?: (id: string | null) => void
}

export default function CategoryList({ resourceId, onResourceClick, onResourceHover }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [resources, setResources] = useState<ResourceWithRelations[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
    try {
      const savedFilters = Cookies.get('activeFilters')
      return savedFilters ? new Set(JSON.parse(savedFilters)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>(() => {
    try {
      const savedContentTypes = Cookies.get('contentTypeFilter')
      return savedContentTypes ? new Set(JSON.parse(savedContentTypes)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(() => {
    try {
      const savedCategories = Cookies.get('categoryFilter')
      return savedCategories ? new Set(JSON.parse(savedCategories)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewType, setViewType] = useState<ViewType>(() => {
    const savedView = Cookies.get('preferredView')
    return (savedView as ViewType) || 'grid'
  })
  const { data: session } = useSession()
  const [showInstallHelp, setShowInstallHelp] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const { setShowPathwayModal, setSelectedPathway, showPathwayModal } = usePathway()
  const [pathways, setPathways] = useState([])
  const router = useRouter()
  const pathname = usePathname()
  const [sortType, setSortType] = useState<SortType>('custom')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Save view preference when it changes
  useEffect(() => {
    Cookies.set('preferredView', viewType, { expires: 365 })
  }, [viewType])

  // Save filters when they change
  useEffect(() => {
    Cookies.set('activeFilters', JSON.stringify(Array.from(activeFilters)), { expires: 365 })
  }, [activeFilters])

  useEffect(() => {
    Cookies.set('contentTypeFilter', JSON.stringify(Array.from(contentTypeFilter)), { expires: 365 })
  }, [contentTypeFilter])

  useEffect(() => {
    Cookies.set('categoryFilter', JSON.stringify(Array.from(categoryFilter)), { expires: 365 })
  }, [categoryFilter])

  useEffect(() => {
    fetchData()
  }, [])

  // Apply URL-based filtering when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      applyUrlFiltering();
    }
  }, [categories, pathname]);

  // Parse URL path to extract category for filtering
  const applyUrlFiltering = () => {
    if (!pathname || !categories.length) return;
    
    // Handle paths like /ai/resources or /category-slug/resources
    const parts = pathname.split('/').filter(Boolean);
    
    if (parts.length >= 1 && parts[parts.length-1] !== 'resources') {
      const categorySlug = parts[0].toLowerCase();
      
      // Find category by name (convert to slug for comparison)
      const category = categories.find(cat => 
        cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
      );
      
      if (category) {
        // Set the category filter to show only this category
        setCategoryFilter(new Set([category.id]));
      }
    }
  };

  // Function to get a category's slug
  const getCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  // Handle category link clicks
  const handleCategoryLinkClick = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      const slug = getCategorySlug(category.name);
      // Navigate to the URL without page reload
      router.push(`/${slug}/resources`);
      // Also set the filter
      setCategoryFilter(new Set([categoryId]));
    }
  };

  // Refresh data when resourceId changes (e.g., when a resource is favorited/completed in the modal)
  useEffect(() => {
    if (resourceId) {
      fetchData()
    }
  }, [resourceId])

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
      const data = await response.json()
      
      setResources(prevResources => 
        prevResources.map(resource => {
          if (resource.id === resourceId) {
            const newFavoritedBy = data.isFavorite
              ? [...resource.favoritedBy, { id: session.user.id } as User]
              : resource.favoritedBy.filter(u => u.id !== session.user.id)
            return {
              ...resource,
              favoritedBy: newFavoritedBy
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
      
      setResources(prevResources => 
        prevResources.map(resource => {
          if (resource.id === resourceId) {
            const newCompletedBy = data.isCompleted
              ? [...resource.completedBy, { id: session.user.id } as User]
              : resource.completedBy.filter(u => u.id !== session.user.id)
            return {
              ...resource,
              completedBy: newCompletedBy
            }
          }
          return resource
        })
      )
    } catch (error) {
      console.error('Error toggling complete:', error)
    }
  }

  const sortResources = (resources: ResourceWithRelations[]) => {
    if (sortType === 'custom') {
      return resources.sort((a, b) => {
        const aOrder = a.orders?.find(o => o.userId === session?.user?.id)?.order ?? 0
        const bOrder = b.orders?.find(o => o.userId === session?.user?.id)?.order ?? 0
        return aOrder - bOrder
      })
    }

    return [...resources].sort((a, b) => {
      let comparison = 0
      switch (sortType) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'date':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case 'progress':
          const aProgress = a.completedBy.length
          const bProgress = b.completedBy.length
          comparison = aProgress - bProgress
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }

  const filteredResources = (categoryId: string) => {
    return sortResources(
      resources.filter(resource => {
        const matchesSearch = searchTerm === '' || 
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (resource.description?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())

        const matchesCategoryFilter = categoryFilter.size === 0 || categoryFilter.has(resource.categoryId)
        const matchesCategoryView = resource.categoryId === categoryId
        
        const matchesContentType = contentTypeFilter.size === 0 || contentTypeFilter.has(resource.contentType)

        if (activeFilters.size === 0) return matchesSearch && matchesCategoryFilter && matchesCategoryView && matchesContentType

        const isFavorite = resource.favoritedBy.some(u => u.id === session?.user?.id)
        const isCompleted = resource.completedBy.some(u => u.id === session?.user?.id)

        const matchesFilters = (
          (activeFilters.has('favorites') && isFavorite) ||
          (activeFilters.has('completed') && isCompleted) ||
          (activeFilters.has('incomplete') && !isCompleted)
        )

        return matchesSearch && matchesCategoryFilter && matchesCategoryView && matchesFilters && matchesContentType
      })
    )
  }

  const getCategoryIcon = (categoryName: string) => {
    const letters = categoryName.slice(0, 2).toUpperCase()
    return (
      <span 
        className="d-inline-flex align-items-center justify-content-center border" 
        style={{ 
          width: '12px', 
          height: '12px', 
          fontSize: '8px',
          fontWeight: 500,
          borderWidth: '1px',
          borderRadius: '2px',
          marginRight: '6px'
        }}
      >
        {letters}
      </span>
    )
  }

  const fetchPathways = async () => {
    try {
      const response = await fetch('/api/pathways')
      if (!response.ok) throw new Error('Failed to fetch pathways')
      const data = await response.json()
      setPathways(data)
      return data
    } catch (error) {
      console.error('Error fetching pathways:', error)
      return []
    }
  }

  const handlePathwaysClick = async () => {
    const pathwaysData = await fetchPathways()
    if (pathwaysData.length === 0) {
      // Show some feedback if no pathways are available
      return
    }
    setShowPathwayModal(true)
  }

  const handleResourceClick = (resource: ResourceWithRelations) => {
    // Always use the callback if available
    if (onResourceClick) {
      onResourceClick(resource.id)
    } else {
      // If no callback, update hash without causing a reload
      if (typeof window !== 'undefined') {
        const scrollPosition = window.pageYOffset
        history.pushState(null, '', `#resource=${resource.id}`)
        window.scrollTo(0, scrollPosition)
      }
    }
  }

  const handleResourceHover = (resource: ResourceWithRelations | null) => {
    if (onResourceHover) {
      onResourceHover(resource?.id || null)
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

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error loading data</Alert.Heading>
        <p>{error}</p>
      </Alert>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }} className="min-vh-100">
      <div className="bg-white shadow-sm">
        <Container className="py-3">
          <div className="d-flex align-items-center justify-content-between gap-4 flex-wrap">
            <div className="d-flex align-items-center gap-3">
              <Image 
                src="/logo-ols-2023.png" 
                alt="Logo" 
                width={48}
                height={48}
                style={{ objectFit: 'contain' }}
              />

              <div style={{ maxWidth: '320px', width: '100%' }}>
                <SearchBar 
                  searchTerm={searchTerm} 
                  onSearchChange={setSearchTerm}
                  className="w-100"
                />
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="d-flex gap-2 flex-wrap">
              <Button
                key="all-categories"
                variant={categoryFilter.size === 0 ? "primary" : "outline-primary"}
                size="sm"
                className="d-flex align-items-center"
                onClick={() => {
                  setCategoryFilter(new Set());
                  router.push('/');
                }}
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={categoryFilter.has(category.id) ? "primary" : "outline-primary"}
                  size="sm"
                  className="d-flex align-items-center"
                  onClick={() => handleCategoryLinkClick(category.id)}
                >
                  {getCategoryIcon(category.name)}
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="d-flex gap-2">
              <ButtonGroup>
                <Button
                  variant={viewType === 'grid' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewType('grid')}
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '38px' }}
                >
                  <Grid size={18} />
                </Button>
                <Button
                  variant={viewType === 'list' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewType('list')}
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '38px' }}
                >
                  <List size={18} />
                </Button>
                <Button
                  variant={viewType === 'columns' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewType('columns')}
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '38px' }}
                >
                  <Columns size={18} />
                </Button>
              </ButtonGroup>

              <div className="d-flex align-items-center gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" style={{ height: '38px' }}>
                    Sort: {sortType} {sortDirection === 'asc' ? '↑' : '↓'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item 
                      active={sortType === 'custom'} 
                      onClick={() => setSortType('custom')}
                    >
                      Custom Order
                    </Dropdown.Item>
                    <Dropdown.Item 
                      active={sortType === 'title'} 
                      onClick={() => {
                        setSortType('title')
                        setSortDirection(prev => sortType === 'title' ? (prev === 'asc' ? 'desc' : 'asc') : 'asc')
                      }}
                    >
                      Title {sortType === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </Dropdown.Item>
                    <Dropdown.Item 
                      active={sortType === 'date'} 
                      onClick={() => {
                        setSortType('date')
                        setSortDirection(prev => sortType === 'date' ? (prev === 'asc' ? 'desc' : 'asc') : 'desc')
                      }}
                    >
                      Date Added {sortType === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </Dropdown.Item>
                    <Dropdown.Item 
                      active={sortType === 'progress'} 
                      onClick={() => {
                        setSortType('progress')
                        setSortDirection(prev => sortType === 'progress' ? (prev === 'asc' ? 'desc' : 'asc') : 'desc')
                      }}
                    >
                      Progress {sortType === 'progress' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <FilterFlyout
                  contentTypeFilter={contentTypeFilter}
                  setContentTypeFilter={setContentTypeFilter}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  categories={categories}
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
              </div>

              <div className="d-flex gap-2">
                <AddResourceButton />
                <AuthButton />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Active Filter Badges */}
      {(activeFilters.size > 0 || contentTypeFilter.size > 0 || categoryFilter.size > 0) && (
        <div className="bg-white shadow-sm border-bottom">
          <Container>
            <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap" style={{ paddingTop: '4px', paddingBottom: '4px' }}>
              {Array.from(categoryFilter).map(categoryId => {
                const category = categories.find(c => c.id === categoryId)
                return category ? (
                  <span key={categoryId} className="badge d-flex align-items-center" style={{ backgroundColor: '#675a95', color: 'white' }}>
                    {getCategoryIcon(category.name)}
                    {category.name}
                  </span>
                ) : null
              })}
              {Array.from(contentTypeFilter).map(type => (
                <span key={type} className="badge d-flex align-items-center gap-2" style={{ backgroundColor: '#006ba5', color: 'white' }}>
                  {type === 'Resource' && <Book size={12} />}
                  {type === 'Training' && <GraduationCap size={12} />}
                  {type === 'Shortcut' && <Command size={12} />}
                  {type === 'Plugin' && <Puzzle size={12} />}
                  {type}
                </span>
              ))}
              {activeFilters.has('favorites') && (
                <span className="badge d-flex align-items-center gap-2" style={{ backgroundColor: '#f0e0a4', color: '#333' }}>
                  <Star size={12} />
                  Favorites
                </span>
              )}
              {activeFilters.has('completed') && (
                <span className="badge d-flex align-items-center gap-2" style={{ backgroundColor: '#9bc7a3', color: 'white' }}>
                  <CheckCircle size={12} />
                  Completed
                </span>
              )}
              {activeFilters.has('incomplete') && (
                <span className="badge d-flex align-items-center gap-2" style={{ backgroundColor: '#e63478', color: 'white' }}>
                  <XCircle size={12} />
                  Incomplete
                </span>
              )}
            </div>
          </Container>
        </div>
      )}

      <Container className="py-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="mt-4">
            {viewType === 'columns' ? (
              <div 
                className="position-fixed start-0 end-0 bottom-0"
                style={{ 
                  top: '128px', // Increased to account for badges
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem'
                }}
              >
                <Container fluid className="h-100">
                  <div 
                    className="d-flex gap-4 mx-auto" 
                    style={{ 
                      overflowX: 'auto',
                      height: '100%',
                      padding: '0.5rem',
                    }}
                  >
                    {categories
                      .filter(category => categoryFilter.size === 0 || categoryFilter.has(category.id))
                      .map(category => (
                      <div 
                        key={category.id} 
                        className="bg-white rounded-3 shadow-sm text-dark"
                        style={{ 
                          flex: '1 0 350px',
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
                                height: 'calc(100vh - 200px)',
                                overflowY: 'auto'
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
                                    onClick={() => handleResourceClick(resource)}
                                    onMouseEnter={() => handleResourceHover(resource)}
                                    onMouseLeave={() => handleResourceHover(null)}
                                    standalone={true}
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
                </Container>
              </div>
            ) : (
              <div 
                className="position-fixed start-0 end-0 bottom-0"
                style={{ 
                  top: '128px',
                  backgroundColor: '#f8f9fa',
                  padding: '2rem',
                  overflowY: 'auto'
                }}
              >
                <Container fluid>
                  {categories
                    .filter(category => categoryFilter.size === 0 || categoryFilter.has(category.id))
                    .map(category => {
                      const categoryResources = filteredResources(category.id);
                      if (categoryResources.length === 0) return null;
                      
                      return (
                        <div key={category.id} className="resource-section">
                          <div className="category-header">
                            <div className="d-flex justify-content-between align-items-center">
                              <h3>{category.name}</h3>
                              <small>
                                {categoryResources.length} resource{categoryResources.length === 1 ? '' : 's'}
                              </small>
                            </div>
                            {category.description && (
                              <p className="text-muted mb-0 mt-1">{category.description}</p>
                            )}
                          </div>
                          <div className={viewType === 'grid' ? 'grid-tiles' : 'list-view'}>
                            {categoryResources.map((resource, index) => (
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
                                onClick={() => handleResourceClick(resource)}
                                onMouseEnter={() => handleResourceHover(resource)}
                                onMouseLeave={() => handleResourceHover(null)}
                                standalone={true}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </Container>
              </div>
            )}
          </div>
        </DragDropContext>
      </Container>

      <AdminModal 
        show={showAdminModal} 
        onHide={() => setShowAdminModal(false)} 
      />

      <PathwayModal
        show={showPathwayModal}
        onHide={() => {
          setShowPathwayModal(false)
          setSelectedPathway(null)
        }}
        pathways={pathways}
      />
    </div>
  )
} 