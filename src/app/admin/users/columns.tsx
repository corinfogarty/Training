import { ColumnDef } from "@tanstack/react-table"
import { UserRole } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export const columns: ColumnDef[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("role")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      
      return (
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )
    },
  },
] 