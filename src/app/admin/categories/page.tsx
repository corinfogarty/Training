'use client'

import { Table, Button, Container } from 'react-bootstrap'
import { columns } from "./columns"
import { Plus } from "lucide-react"
import { useEffect, useState } from 'react'
import { prisma } from '@/lib/prisma'

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    }
    fetchCategories()
  }, [])
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Categories</h1>
        <Button>
          <Plus className="me-2" size={16} /> Add Category
        </Button>
      </div>
      <div className="bg-white rounded shadow-sm">
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td className="text-end">
                  <Button variant="link" className="p-0">
                    <Plus size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  )
} 