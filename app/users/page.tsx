'use client'

import React, { useState, useEffect } from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import { Calendar, Clock, CheckCircle, Eye } from 'lucide-react'
import UserActivityModal from '../../components/UserActivityModal'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  name: string
  email: string
  image?: string
  lastLogin?: Date
  completedResources?: {
    id: string
    title: string
    completedAt: Date
  }[]
}

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const handleViewActivity = (user: User) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Users</h1>
      </div>

      <div className="bg-white rounded shadow-sm">
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Completed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="rounded-circle me-2"
                        width={32}
                        height={32}
                      />
                    )}
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className="align-middle">{user.email}</td>
                <td className="align-middle">
                  {user.lastLogin && (
                    <div className="d-flex align-items-center text-muted">
                      <Calendar size={14} className="me-1" />
                      {new Date(user.lastLogin).toLocaleDateString()}
                      <Clock size={14} className="ms-2 me-1" />
                      {new Date(user.lastLogin).toLocaleTimeString()}
                    </div>
                  )}
                </td>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <CheckCircle size={14} className="text-success me-1" />
                    {user.completedResources?.length || 0} resources
                  </div>
                </td>
                <td className="align-middle text-end">
                  <Button
                    variant="link"
                    className="text-muted p-0"
                    onClick={() => handleViewActivity(user)}
                  >
                    <Eye size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <UserActivityModal
        user={selectedUser}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </Container>
  )
} 