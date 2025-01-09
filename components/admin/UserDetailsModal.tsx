import { Modal, Button, ListGroup } from 'react-bootstrap'
import { User, Resource, CompletedResource } from '@prisma/client'

type UserWithDetails = User & {
  completedResources: (CompletedResource & {
    resource: Resource
  })[]
  favorites: Resource[]
}

interface UserDetailsModalProps {
  user: UserWithDetails | null
  show: boolean
  onHide: () => void
}

export default function UserDetailsModal({ user, show, onHide }: UserDetailsModalProps) {
  if (!user) return null

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User Details: {user.name || user.email}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5>Basic Information</h5>
          <ListGroup>
            <ListGroup.Item>
              <strong>Email:</strong> {user.email}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Account Created:</strong>{' '}
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Last Login:</strong>{' '}
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Never'}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Admin Status:</strong>{' '}
              <span className={user.isAdmin ? 'text-success' : 'text-danger'}>
                {user.isAdmin ? 'Admin' : 'Regular User'}
              </span>
            </ListGroup.Item>
          </ListGroup>
        </div>

        <div className="mb-4">
          <h5>Activity Summary</h5>
          <ListGroup>
            <ListGroup.Item>
              <strong>Completed Resources:</strong> {user.completedResources.length}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Favorited Resources:</strong> {user.favorites.length}
            </ListGroup.Item>
          </ListGroup>
        </div>

        {user.completedResources.length > 0 && (
          <div className="mb-4">
            <h5>Recently Completed Resources</h5>
            <ListGroup>
              {user.completedResources.slice(0, 5).map((completion) => (
                <ListGroup.Item key={completion.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{completion.resource.title}</span>
                    <small className="text-muted">
                      {new Date(completion.completedAt).toLocaleDateString()}
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {user.favorites.length > 0 && (
          <div>
            <h5>Favorited Resources</h5>
            <ListGroup>
              {user.favorites.slice(0, 5).map((resource) => (
                <ListGroup.Item key={resource.id}>
                  {resource.title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
} 