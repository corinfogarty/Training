'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Plus, Star, CheckCircle, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { Container, Card, Button } from 'react-bootstrap'
import ResourceCard from '@/components/ResourceCard'
import PathwayModal from './PathwayModal'
import { usePathway } from './PathwayContext'

type Resource = {
  id: string
  title: string
  description: string
  url: string
  additionalUrls: string[]
  previewImage: string | null
  categoryId: string
  createdAt: Date
  updatedAt: Date
  contentType: 'Resource' | 'Training' | 'Shortcut' | 'Plugin'
  submittedById: string | null
  notes?: string
  duration?: string
}

type PathwayResource = {
  id: string
  resourceId: string
  order: number
  notes?: string
  resource: Resource
}

type Pathway = {
  id: string
  title: string
  description: string
  createdBy: {
    name: string
    image: string
  }
  resources: PathwayResource[]
}

export default function PathwayList({ pathways }: { pathways: Pathway[] }) {
  const { setSelectedPathway, showPathwayModal, setShowPathwayModal } = usePathway()
  const { data: session } = useSession()

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
          <Link href="/admin/pathways">
            <Button variant="primary" className="d-flex align-items-center gap-2">
              <Plus size={16} />
              Create Pathway
            </Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="min-vh-100">
      <div className="p-4">
        <h2 className="h4 fw-bold mb-4">Pathways</h2>
        <div className="grid-tiles">
          {pathways.map(pathway => (
            <Card 
              key={pathway.id} 
              className="cursor-pointer h-100"
              onClick={() => handleSelectPathway(pathway)}
            >
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="mb-2 fw-semibold">{pathway.title}</h6>
                  <Image
                    src={pathway.createdBy.image}
                    alt={pathway.createdBy.name}
                    width={20}
                    height={20}
                    className="rounded-circle"
                  />
                </div>
                <p className="small text-muted mb-2 line-clamp-2">
                  {pathway.description}
                </p>
                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-muted p-0"
                    >
                      <Star size={16} />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-muted p-0"
                    >
                      <CheckCircle size={16} />
                    </Button>
                    {session?.user?.isAdmin && (
                      <>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-muted p-0"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="small fw-medium mb-0">
                    {pathway.resources.length} resource{pathway.resources.length === 1 ? '' : 's'}
                  </p>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      <PathwayModal
        show={showPathwayModal}
        onHide={() => {
          setShowPathwayModal(false)
          setSelectedPathway(null)
        }}
      />
    </div>
  )
} 