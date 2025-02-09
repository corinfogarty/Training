'use client'

import { useEffect } from 'react'
import { usePathway } from '@/components/PathwayContext'
import PathwayList from '@/components/PathwayList'
import type { Pathway, Resource } from '@prisma/client'

type PathwayResource = {
  id: string
  resourceId: string
  order: number
  notes?: string
  resource: Resource
}

type PathwayData = {
  id: string
  title: string
  description: string
  createdBy: {
    name: string
    image: string
  }
  resources: PathwayResource[]
}

type PathwayWithRelations = {
  id: string
  title: string
  description: string
  createdBy: {
    name: string | null
    image: string | null
  }
  resources: {
    id: string
    resourceId: string
    order: number
    notes: string | null
    resource: Resource
  }[]
}

interface PathwaysClientProps {
  pathways: PathwayWithRelations[]
}

export default function PathwaysClient({ pathways }: PathwaysClientProps) {
  const { setShowPathwayModal, setSelectedPathway } = usePathway()

  const transformedPathways: PathwayData[] = pathways.map(pathway => ({
    ...pathway,
    createdBy: {
      name: pathway.createdBy.name || 'Anonymous',
      image: pathway.createdBy.image || '/default-avatar.png'
    },
    resources: pathway.resources.map(resource => ({
      ...resource,
      notes: resource.notes || undefined
    }))
  }))

  return <PathwayList pathways={transformedPathways} />
} 