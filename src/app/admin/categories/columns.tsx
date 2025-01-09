import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "react-bootstrap"
import { MoreHorizontal, Edit, Trash } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string | null
  defaultImage: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.getValue("description") || "-"
  },
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString()
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original
      
      return (
        <div className="flex gap-2">
          <Button variant="outline-primary" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline-danger" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
] 