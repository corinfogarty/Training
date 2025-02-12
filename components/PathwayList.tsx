'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Plus, Star, CheckCircle, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { Container, Card, Button, ProgressBar } from 'react-bootstrap'
import ResourceCard from '@/components/ResourceCard'
import PathwayModal from './PathwayModal'
import { usePathway } from './PathwayContext'
import { usePathwayProgress } from '@/hooks/usePathwayProgress'
import { useRouter } from 'next/navigation'
import { Resource, Category } from '@prisma/client'

type ResourceWithRelations = Resource & {
  category?: Category | null
  submittedBy?: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  } | null
}

type PathwayResource = {
  id: string
  resourceId: string
  order: number
  notes?: string
  resource: ResourceWithRelations
}

type Pathway = {
  id: string
  title: string
  description: string
  createdBy: {
    id: string
    name: string
    image: string
  }
  resources: PathwayResource[]
}

export default function PathwayList({ pathways }: { pathways: Pathway[] }) {
  const { setSelectedPathway, showPathwayModal, setShowPathwayModal } = usePathway()
  const { data: session } = useSession()
  const router = useRouter()
  const { progressData, loading } = usePathwayProgress()

  const handleSelectPathway = (pathway: Pathway) => {
    setSelectedPathway(pathway)
    setShowPathwayModal(true)
  }

  if (pathways.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-50 p-4">
        <h2 className="h4 fw-bold mb-3">No Pathways Available</h2>
        <p className="text-muted mb-4">There are no learning pathways published yet.</p>
        {session?.user?.isAdmin && (
          <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => router.push('/admin/pathways')}>
            <Plus size={16} />
            Create Pathway
          </Button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="container">
        <div className="grid-tiles">
          {pathways.map(pathway => {
            const progress = progressData[pathway.id]
            
            return (
              <Card 
                key={pathway.id} 
                className="h-100 cursor-pointer"
                onClick={() => handleSelectPathway(pathway)}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title mb-0">{pathway.title}</h5>
                    {pathway.createdBy.image && (
                      <Image
                        src={pathway.createdBy.image}
                        alt={pathway.createdBy.name}
                        width={24}
                        height={24}
                        className="rounded-circle"
                      />
                    )}
                  </div>
                  <p className="card-text text-muted small">{pathway.description}</p>
                  
                  {session?.user && (
                    <div className="mt-3">
                      <ProgressBar 
                        now={progress?.progress || 0} 
                        label={`${Math.round(progress?.progress || 0)}%`}
                        className="mb-2"
                      />
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {pathway.resources.length} resource{pathway.resources.length === 1 ? '' : 's'}
                        </small>
                        {progress && (
                          <small className="text-muted">
                            {progress.completedResources} completed
                          </small>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {!session?.user && (
                    <div className="mt-2 text-end">
                      <small className="text-muted">
                        {pathway.resources.length} resource{pathway.resources.length === 1 ? '' : 's'}
                      </small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )
          })}
        </div>
      </div>

      <PathwayModal
        show={showPathwayModal}
        onHide={() => {
          setShowPathwayModal(false)
          setSelectedPathway(null)
        }}
        pathways={pathways}
      />
    </div>
  )
} 