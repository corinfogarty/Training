import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, Row, Col, Tabs, Tab, Alert, Badge, Modal } from 'react-bootstrap'
import { Trophy, Star, BookOpen, Award } from 'lucide-react'
import UserProgress from './UserProgress'
import PathwayProgress from './PathwayProgress'

interface AccountModalProps {
  show: boolean
  onHide: () => void
}

export default function AccountModal({ show, onHide }: AccountModalProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  if (!session?.user) {
    return (
      <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
        <Modal.Header closeButton>
          <Modal.Title>My Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">Please sign in to view your account.</Alert>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>My Account</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="p-4">
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <div className="text-center mb-3">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ''}
                        className="rounded-circle mb-3"
                        width={96}
                        height={96}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle mb-3 bg-secondary d-flex align-items-center justify-content-center text-white mx-auto"
                        style={{ width: '96px', height: '96px', fontSize: '2rem' }}
                      >
                        {session.user.name?.[0] || session.user.email[0]}
                      </div>
                    )}
                    <h4 className="mb-1">{session.user.name || 'Anonymous'}</h4>
                    <p className="text-muted mb-3">{session.user.email}</p>
                  </div>

                  <hr />

                  <h5 className="mb-3">Achievements</h5>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center p-2 bg-light rounded">
                      <Trophy size={20} className="text-success me-2" />
                      <div>
                        <div className="fw-bold">Learning Champion</div>
                        <small className="text-muted">Complete 10+ resources</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center p-2 bg-light rounded">
                      <Star size={20} className="text-primary me-2" />
                      <div>
                        <div className="fw-bold">Content Creator</div>
                        <small className="text-muted">Submit 5+ resources</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center p-2 bg-light rounded">
                      <BookOpen size={20} className="text-warning me-2" />
                      <div>
                        <div className="fw-bold">Curator</div>
                        <small className="text-muted">Favorite 15+ resources</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center p-2 bg-light rounded">
                      <Award size={20} className="text-info me-2" />
                      <div>
                        <div className="fw-bold">Active Learner</div>
                        <small className="text-muted">Active in the last 7 days</small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              <Card>
                <Card.Body>
                  <Tabs defaultActiveKey="resources" className="mb-4">
                    <Tab eventKey="resources" title="Resources">
                      <UserProgress userId={session.user.id} className="mt-4" />
                    </Tab>
                    <Tab eventKey="pathways" title="Pathways">
                      <PathwayProgress userId={session.user.id} className="mt-4" />
                    </Tab>
                    <Tab eventKey="submitted" title="Submitted">
                      <div className="mt-4">
                        <UserProgress userId={session.user.id} showSubmitted={true} className="mt-4" />
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  )
} 