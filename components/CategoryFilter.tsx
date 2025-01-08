'use client'

import { ButtonGroup, Button } from 'react-bootstrap'
import { Star, CheckCircle, XCircle } from 'react-bootstrap-icons'

type FilterType = 'all' | 'favorites' | 'completed' | 'incomplete'
type ActiveFilters = Set<Exclude<FilterType, 'all'>>

interface CategoryFilterProps {
  activeFilters: ActiveFilters
  onFilterChange: (filter: Exclude<FilterType, 'all'>) => void
}

export default function CategoryFilter({ activeFilters, onFilterChange }: CategoryFilterProps) {
  return (
    <ButtonGroup>
      <Button
        variant={activeFilters.has('favorites') ? 'warning' : 'outline-warning'}
        onClick={() => onFilterChange('favorites')}
        className="d-flex align-items-center gap-2"
      >
        <Star /> Favorites
      </Button>
      <Button
        variant={activeFilters.has('completed') ? 'success' : 'outline-success'}
        onClick={() => onFilterChange('completed')}
        className="d-flex align-items-center gap-2"
      >
        <CheckCircle /> Completed
      </Button>
      <Button
        variant={activeFilters.has('incomplete') ? 'info' : 'outline-info'}
        onClick={() => onFilterChange('incomplete')}
        className="d-flex align-items-center gap-2"
      >
        <XCircle /> Incomplete
      </Button>
    </ButtonGroup>
  )
} 