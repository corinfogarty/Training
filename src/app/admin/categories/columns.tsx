import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "react-bootstrap"
import { MoreHorizontal } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original
      
      return (
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )
    },
  },
] 