'use client'

import { usePathway } from '@/components/PathwayContext'
import PathwayList from '@/components/PathwayList'
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
  notes: string | null
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

interface PathwaysClientProps {
  pathways: Pathway[]
}

export default function PathwaysClient({ pathways }: PathwaysClientProps) {
  const { setShowPathwayModal, setSelectedPathway } = usePathway()

  const transformedPathways: Pathway[] = pathways.map(pathway => ({
    ...pathway,
    createdBy: {
      name: pathway.createdBy.name || 'Anonymous',
      image: pathway.createdBy.image || '/default-avatar.png'
    },
    resources: pathway.resources.map(resource => ({
      ...resource,
      notes: resource.notes
    }))
  }))

  return <PathwayList pathways={transformedPathways} />
} 