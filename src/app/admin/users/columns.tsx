import { ColumnDef } from "@tanstack/react-table"
import { Button } from "react-bootstrap"
import { MoreHorizontal } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isAdmin",
    header: "Role",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("isAdmin") ? "Admin" : "User"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      
      return (
        <Button variant="link" className="p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )
    },
  },
] 