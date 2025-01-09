import React from 'react'
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { getAllCategories } from "@/lib/actions/category"
import { Button } from "react-bootstrap"
import { Plus } from "lucide-react"

export default async function AdminCategoriesPage() {
  try {
    const categories = await getAllCategories()
    
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
        <DataTable columns={columns} data={categories} />
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="alert alert-danger">
          Error loading categories: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    )
  }
} 