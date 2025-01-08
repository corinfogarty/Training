'use client'

import { Table, Button, Container } from 'react-bootstrap'
import { columns } from "./columns"
import { Plus } from "lucide-react"
import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    }
    fetchUsers()
  }, [])
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Users</h1>
        <Button>
          <Plus className="me-2" size={16} /> Add User
        </Button>
      </div>
      <div className="bg-white rounded shadow-sm">
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>
                  <span className="capitalize">{user.isAdmin ? "Admin" : "User"}</span>
                </td>
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