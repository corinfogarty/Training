'use client'

import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { Droppable } from '@hello-pangea/dnd'
import { Resource, Category } from '@prisma/client'
import ResourceCard from './ResourceCard'
import AddResourceButton from './AddResourceButton'

interface CategoryColumnProps {
  category: Category
  resources: (Resource & {
    category: Category  // Include category relation in type
  })[]
  favorites: string[]
  completed: string[]
  onResourceAdded: () => void
  onResourceDeleted: () => void
  onToggleFavorite: (resourceId: string) => void
  onToggleComplete: (resourceId: string) => void
}

export default function CategoryColumn({
  category,
  resources,
  favorites,
  completed,
  onResourceAdded,
  onResourceDeleted,
  onToggleFavorite,
  onToggleComplete
}: CategoryColumnProps) {
  return (
    <div className="kanban-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="h5 mb-1">{category.name}</h3>
          <small className="text-muted">{resources.length} resources</small>
        </div>
        <AddResourceButton 
          categoryId={category.id} 
          onResourceAdded={onResourceAdded}
        />
      </div>

      <Droppable droppableId={category.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {resources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}  // Resource now includes category
                index={index}
                isFavorite={favorites.includes(resource.id)}
                isCompleted={completed.includes(resource.id)}
                onDelete={onResourceDeleted}
                onToggleFavorite={() => onToggleFavorite(resource.id)}
                onToggleComplete={() => onToggleComplete(resource.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
} 