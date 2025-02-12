'use client'

import { useParams } from 'next/navigation'
import { Tabs, Tab } from 'react-bootstrap'
import UserProgress from '@/components/UserProgress'
import PathwayProgress from '@/components/PathwayProgress'

export default function UserProgressPage() {
  const params = useParams()
  const userId = params?.id as string

  if (!userId) {
    return <div className="container py-4">User ID not found</div>
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">User Progress</h1>
      <Tabs defaultActiveKey="resources" className="mb-4">
        <Tab eventKey="resources" title="Resources">
          <UserProgress userId={userId} className="mt-4" />
        </Tab>
        <Tab eventKey="pathways" title="Pathways">
          <PathwayProgress userId={userId} className="mt-4" />
        </Tab>
      </Tabs>
    </div>
  )
} 