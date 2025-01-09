'use client'

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Row, Col } from "react-bootstrap"
import AddResourceButton from "./AddResourceButton"
import AuthButton from "./AuthButton"
import { Category } from "@prisma/client"

interface CategoryListProps {
  categories: Category[]
}

export default function CategoryList({ categories: initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState(initialCategories)

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(categories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setCategories(items)

    try {
      await fetch(`/api/categories/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          categories: items.map((cat, index) => ({
            id: cat.id,
            order: index
          }))
        })
      })
    } catch (error) {
      console.error("Error updating category order:", error)
    }
  }

  const handleResourceAdded = () => {
    // Refresh categories
  }

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories" direction="horizontal">
          {(provided) => (
            <Row
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-nowrap overflow-auto flex-grow-1 g-0 m-0"
            >
              {categories.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id}
                  index={index}
                >
                  {(provided) => (
                    <Col
                      xs="auto"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        width: "300px",
                        height: "100%"
                      }}
                      className="px-2"
                    >
                      <div className="bg-white rounded shadow-sm p-3 h-100">
                        <h3 className="h5 mb-3">{category.name}</h3>
                        <AddResourceButton
                          categoryId={category.id}
                          onResourceAdded={handleResourceAdded}
                        />
                      </div>
                    </Col>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Row>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
} 