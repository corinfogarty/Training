import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { getAllUsers } from "@/lib/actions/user"

export default async function AdminUsersPage() {
  const users = await getAllUsers()
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <DataTable columns={columns} data={users} />
    </div>
  )
} 