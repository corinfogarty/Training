'use client'

import { Modal, Table } from 'react-bootstrap'
import { Calendar, Clock, ExternalLink } from 'lucide-react'

interface UserActivityModalProps {
  user: {
    id: string
    name: string
    email: string
    image?: string
    completedResources?: {
      id: string
      title: string
      completedAt: Date
    }[]
  } | null
  show: boolean
  onHide: () => void
}

export default function UserActivityModal({ user, show, onHide }: UserActivityModalProps) {
  if (!user) return null

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          {user.image && (
            <img
              src={user.image}
              alt={user.name}
              className="rounded-circle me-2"
              width={32}
              height={32}
            />
          )}
          {user.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="text-muted mb-3">Completed Resources</h6>
        {user.completedResources && user.completedResources.length > 0 ? (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Completed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {user.completedResources.map(resource => (
                <tr key={resource.id}>
                  <td>{resource.title}</td>
                  <td>
                    <div className="d-flex align-items-center text-muted">
                      <Calendar size={14} className="me-1" />
                      {new Date(resource.completedAt).toLocaleDateString()}
                      <Clock size={14} className="ms-2 me-1" />
                      {new Date(resource.completedAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="text-end">
                    <a
                      href={`/resources/${resource.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted mb-0">No completed resources yet.</p>
        )}
      </Modal.Body>
    </Modal>
  )
} 