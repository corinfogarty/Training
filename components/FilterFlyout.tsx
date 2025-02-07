import { Button, Popover, Overlay, ButtonGroup } from 'react-bootstrap'
import { Filter, Star, CheckCircle, XCircle } from 'react-bootstrap-icons'
import { useRef, useState } from 'react'
import type { ContentType, Category } from '@prisma/client'
import type { Dispatch, SetStateAction } from 'react'

type FilterType = 'all' | 'favorites' | 'completed' | 'incomplete'
type ActiveFilters = Set<Exclude<FilterType, 'all'>>
type ContentTypeFilter = Set<ContentType>
type CategoryFilter = Set<string>

interface FilterFlyoutProps {
  contentTypeFilter: ContentTypeFilter
  setContentTypeFilter: Dispatch<SetStateAction<ContentTypeFilter>>
  categoryFilter: CategoryFilter
  setCategoryFilter: Dispatch<SetStateAction<CategoryFilter>>
  categories: Category[]
  activeFilters: ActiveFilters
  onFilterChange: (filter: Exclude<FilterType, 'all'>) => void
}

export default function FilterFlyout({ 
  contentTypeFilter, 
  setContentTypeFilter, 
  categoryFilter,
  setCategoryFilter,
  categories,
  activeFilters, 
  onFilterChange 
}: FilterFlyoutProps) {
  const [show, setShow] = useState(false)
  const target = useRef(null)

  const getActiveFilterCount = () => {
    let count = 0
    count += contentTypeFilter.size
    count += categoryFilter.size
    count += activeFilters.size
    return count
  }

  const handleClearFilters = () => {
    setContentTypeFilter(new Set())
    setCategoryFilter(new Set())
    // Clear status filters one by one to maintain the same behavior
    Array.from(activeFilters).forEach(filter => onFilterChange(filter))
  }

  const handleContentTypeChange = (type: ContentType) => {
    setContentTypeFilter((prev: ContentTypeFilter) => {
      const newFilters = new Set(prev) as ContentTypeFilter
      if (newFilters.has(type)) {
        newFilters.delete(type)
      } else {
        newFilters.add(type)
      }
      return newFilters
    })
  }

  const handleCategoryChange = (categoryId: string) => {
    setCategoryFilter((prev: CategoryFilter) => {
      const newFilters = new Set(prev) as CategoryFilter
      if (newFilters.has(categoryId)) {
        newFilters.delete(categoryId)
      } else {
        newFilters.add(categoryId)
      }
      return newFilters
    })
  }

  return (
    <>
      <Button
        ref={target}
        variant="outline-secondary"
        onClick={() => setShow(!show)}
        className="d-flex align-items-center gap-2"
      >
        <Filter size={16} />
        <span>Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="badge bg-primary rounded-pill">{getActiveFilterCount()}</span>
        )}
      </Button>

      <Overlay
        target={target.current}
        show={show}
        placement="bottom-end"
        rootClose
        onHide={() => setShow(false)}
      >
        <Popover className="filter-popover" style={{ minWidth: '300px' }}>
          <Popover.Header className="d-flex align-items-center justify-content-between">
            <h3 className="mb-0">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <Button
                variant="link"
                size="sm"
                className="text-muted p-0 text-decoration-none"
                onClick={handleClearFilters}
              >
                Clear all
              </Button>
            )}
          </Popover.Header>
          <Popover.Body>
            <div className="mb-4">
              <h6 className="mb-2">Categories</h6>
              <ButtonGroup vertical className="w-100">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={categoryFilter.has(category.id) ? 'primary' : 'outline-primary'}
                    onClick={() => handleCategoryChange(category.id)}
                    className="d-flex align-items-center gap-2 justify-content-start px-3"
                  >
                    {category.name}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            <div className="mb-4">
              <h6 className="mb-2">Content Type</h6>
              <ButtonGroup vertical className="w-100">
                <Button
                  variant={contentTypeFilter.has('Resource') ? 'primary' : 'outline-primary'}
                  onClick={() => handleContentTypeChange('Resource')}
                  className="d-flex align-items-center gap-2 justify-content-start px-3"
                >
                  Resource
                </Button>
                <Button
                  variant={contentTypeFilter.has('Training') ? 'primary' : 'outline-primary'}
                  onClick={() => handleContentTypeChange('Training')}
                  className="d-flex align-items-center gap-2 justify-content-start px-3"
                >
                  Training
                </Button>
                <Button
                  variant={contentTypeFilter.has('Shortcut') ? 'primary' : 'outline-primary'}
                  onClick={() => handleContentTypeChange('Shortcut')}
                  className="d-flex align-items-center gap-2 justify-content-start px-3"
                >
                  Shortcuts
                </Button>
              </ButtonGroup>
            </div>

            <div>
              <h6 className="mb-2">Status</h6>
              <ButtonGroup vertical className="w-100">
                <Button
                  variant={activeFilters.has('favorites') ? 'warning' : 'outline-warning'}
                  onClick={() => onFilterChange('favorites')}
                  className="d-flex align-items-center gap-2 justify-content-start px-3"
                >
                  <Star /> Favorites
                </Button>
                <Button
                  variant={activeFilters.has('completed') ? 'success' : 'outline-success'}
                  onClick={() => onFilterChange('completed')}
                  className="d-flex align-items-center gap-2 justify-content-start px-3"
                >
                  <CheckCircle /> Completed
                </Button>
                <Button
                  variant={activeFilters.has('incomplete') ? 'info' : 'outline-info'}
                  onClick={() => onFilterChange('incomplete')}
                  className="d-flex align-items-center gap-2 justify-content-start px-3"
                >
                  <XCircle /> Incomplete
                </Button>
              </ButtonGroup>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  )
} 