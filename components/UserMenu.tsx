'use client'

import { useSession, signOut } from 'next-auth/react'
import { Dropdown, Modal, Button } from 'react-bootstrap'
import { RefreshCw, LogOut, User, Settings, Users, Chrome, BookOpen, BarChart, LayoutGrid, Sliders, FileText, FolderTree } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UserProgress from './admin/UserProgress'
import TeamProgress from './admin/TeamProgress'
import AdminUsers from './admin/AdminUsers'
import AdminResources from './admin/AdminResources'
import AdminCategories from './admin/AdminCategories'
import AdminSettings from './admin/AdminSettings'
import AccountModal from './AccountModal'

export default function UserMenu() {
  const { data: session, update: updateSession } = useSession()
  const [updating, setUpdating] = useState(false)
  const [showExtensionModal, setShowExtensionModal] = useState(false)
  const [showTeamProgressModal, setShowTeamProgressModal] = useState(false)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [showResourcesModal, setShowResourcesModal] = useState(false)
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const router = useRouter()

  const refreshProfileImage = async () => {
    try {
      setUpdating(true)
      const response = await fetch('/api/auth/update-image', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to update image')
      }

      await updateSession()
      router.refresh()
    } catch (error) {
      console.error('Error updating profile image:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (!session?.user) return null

  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle variant="link" className="nav-link p-0 d-flex align-items-center text-white text-decoration-none">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || session.user.email}
              className="rounded-circle me-2"
              width={32}
              height={32}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <User size={32} className="me-2" />
          )}
          <span>{session.user.name || session.user.email}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {/* Progress Section */}
          <Dropdown.Item onClick={() => setShowTeamProgressModal(true)}>
            <BarChart size={16} className="me-2" />
            Team Progress
          </Dropdown.Item>

          <Dropdown.Divider />

          {/* Account Section */}
          <Dropdown.Item onClick={() => setShowAccountModal(true)}>
            <User size={16} className="me-2" />
            My Account
          </Dropdown.Item>

          {/* Admin Section */}
          {session?.user?.isAdmin && (
            <>
              <Dropdown.Divider />
              <Dropdown.Header>Admin</Dropdown.Header>
              <Dropdown.Item onClick={() => setShowUsersModal(true)}>
                <Users size={16} className="me-2" />
                Users
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowResourcesModal(true)}>
                <FileText size={16} className="me-2" />
                Resources
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowCategoriesModal(true)}>
                <FolderTree size={16} className="me-2" />
                Categories
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowSettingsModal(true)}>
                <Settings size={16} className="me-2" />
                Settings
              </Dropdown.Item>
            </>
          )}

          {/* Tools Section */}
          <Dropdown.Divider />
          <Dropdown.Header>Tools</Dropdown.Header>
          <Dropdown.Item onClick={() => setShowExtensionModal(true)}>
            <Chrome size={16} className="me-2" />
            Browser Extension
          </Dropdown.Item>

          {/* Sign Out */}
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => signOut()}>
            <LogOut size={16} className="me-2" />
            Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Account Modal */}
      <AccountModal 
        show={showAccountModal}
        onHide={() => setShowAccountModal(false)}
      />

      {/* Team Progress Modal */}
      <Modal
        show={showTeamProgressModal}
        onHide={() => setShowTeamProgressModal(false)}
        size="xl"
        fullscreen="lg-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>Team Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <TeamProgress 
            onUserStatsOpen={() => setShowTeamProgressModal(false)}
            onUserStatsClose={() => setShowTeamProgressModal(true)}
          />
        </Modal.Body>
      </Modal>

      {/* Admin Modals */}
      <Modal
        show={showUsersModal}
        onHide={() => setShowUsersModal(false)}
        size="xl"
        fullscreen="lg-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>Users</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <AdminUsers />
        </Modal.Body>
      </Modal>

      <Modal
        show={showResourcesModal}
        onHide={() => setShowResourcesModal(false)}
        size="xl"
        fullscreen="lg-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>Resources</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <AdminResources />
        </Modal.Body>
      </Modal>

      <Modal
        show={showCategoriesModal}
        onHide={() => setShowCategoriesModal(false)}
        size="xl"
        fullscreen="lg-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <AdminCategories />
        </Modal.Body>
      </Modal>

      <Modal
        show={showSettingsModal}
        onHide={() => setShowSettingsModal(false)}
        size="xl"
        fullscreen="lg-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <AdminSettings />
        </Modal.Body>
      </Modal>

      {/* Extension Modal */}
      <Modal
        show={showExtensionModal}
        onHide={() => setShowExtensionModal(false)}
        className="resource-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Browser Extension</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-3">Installation Instructions</h5>
          <ol className="mb-4">
            <li>Download the extension using the button below</li>
            <li>Unzip the downloaded file</li>
            <li>Open Chrome and go to <code>chrome://extensions</code></li>
            <li>Enable "Developer Mode" in the top right</li>
            <li>Click "Load unpacked" and select the unzipped directory</li>
          </ol>
          <h5 className="mb-3">Features</h5>
          <ul className="mb-4">
            <li>Add resources directly from any webpage</li>
            <li>Automatic title and description extraction</li>
            <li>Preview image detection</li>
            <li>Quick category selection</li>
          </ul>
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button variant="primary" size="lg" as="a" href="/chrome-extension.zip" download className="w-100">
            <Chrome size={16} className="me-2" />
            Download Extension
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
} 