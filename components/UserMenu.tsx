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

export default function UserMenu() {
  const { data: session, update: updateSession } = useSession()
  const [updating, setUpdating] = useState(false)
  const [showExtensionModal, setShowExtensionModal] = useState(false)
  const [showMyProgressModal, setShowMyProgressModal] = useState(false)
  const [showTeamProgressModal, setShowTeamProgressModal] = useState(false)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [showResourcesModal, setShowResourcesModal] = useState(false)
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
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
          <Dropdown.Item onClick={() => setShowMyProgressModal(true)}>
            <User size={16} className="me-2" />
            My Progress
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowTeamProgressModal(true)}>
            <BarChart size={16} className="me-2" />
            Team Progress
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

      {/* Progress Modals */}
      <Modal
        show={showMyProgressModal}
        onHide={() => setShowMyProgressModal(false)}
        size="xl"
        fullscreen="lg-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>My Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <UserProgress />
        </Modal.Body>
      </Modal>

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
      <Modal show={showExtensionModal} onHide={() => setShowExtensionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Install Chrome Extension (Developer Mode)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ol className="mb-4">
            <li className="mb-2">Download the extension ZIP file from <a href="/extension.zip" className="text-primary">here</a></li>
            <li className="mb-2">Unzip the file to a location on your computer</li>
            <li className="mb-2">Open Chrome and go to <code>chrome://extensions</code></li>
            <li className="mb-2">Enable "Developer mode" using the toggle in the top right</li>
            <li className="mb-2">Click "Load unpacked" button in the top left</li>
            <li className="mb-2">Select the unzipped extension folder</li>
            <li>The extension should now appear in your Chrome toolbar</li>
          </ol>
          <div className="alert alert-info">
            <h6 className="alert-heading mb-1">Note</h6>
            <p className="mb-0">This is a temporary installation method while we await approval from the Chrome Web Store. Once approved, you'll be able to install directly from the store.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExtensionModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
} 