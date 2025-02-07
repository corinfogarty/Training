'use client'

import { useState } from 'react'
import { Modal, Nav, Tab } from 'react-bootstrap'
import { Settings, LayoutGrid, Sliders, Users } from 'lucide-react'
import AdminCategories from './admin/AdminCategories'
import AdminSettings from './admin/AdminSettings'
import AdminDashboard from './admin/AdminDashboard'
import dynamic from 'next/dynamic'

const AdminUsersPage = dynamic(() => import('@/app/admin/users/page'), { ssr: false })

interface AdminDashboardModalProps {
  show: boolean
  onHide: () => void
  initialTab?: string
}

export default function AdminDashboardModal({ show, onHide, initialTab = 'dashboard' }: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      dialogClassName="modal-90w"
      style={{ paddingLeft: 0 }}
    >
      <style jsx global>{`
        .modal-90w {
          width: 90%;
          max-width: 1400px;
        }
        .modal-90w .modal-content {
          height: 90vh;
        }
      `}</style>
      <Modal.Header closeButton>
        <Modal.Title>Admin Dashboard</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')}>
          <div className="d-flex h-100">
            <div className="bg-light border-end" style={{ width: '200px' }}>
              <Nav variant="pills" className="flex-column p-2">
                <Nav.Item>
                  <Nav.Link eventKey="dashboard" className="d-flex align-items-center gap-2">
                    <Settings size={16} />
                    Dashboard
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users" className="d-flex align-items-center gap-2">
                    <Users size={16} />
                    Users
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="categories" className="d-flex align-items-center gap-2">
                    <LayoutGrid size={16} />
                    Categories
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="settings" className="d-flex align-items-center gap-2">
                    <Sliders size={16} />
                    Settings
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <div className="flex-grow-1 overflow-auto">
              <Tab.Content>
                <Tab.Pane eventKey="dashboard">
                  <AdminDashboard />
                </Tab.Pane>
                <Tab.Pane eventKey="users">
                  <AdminUsersPage />
                </Tab.Pane>
                <Tab.Pane eventKey="categories">
                  <AdminCategories />
                </Tab.Pane>
                <Tab.Pane eventKey="settings">
                  <AdminSettings />
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  )
} 