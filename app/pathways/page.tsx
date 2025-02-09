import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Skeleton } from '@/components/ui/skeleton'
import { Pathway, Resource } from '@prisma/client'
import PathwaysClient from './PathwaysClient'

type PathwayWithRelations = Pathway & {
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

async function getPathways() {
  const pathways = await prisma.pathway.findMany({
    where: {
      isPublished: true
    },
    include: {
      createdBy: {
        select: {
          name: true,
          image: true
        }
      },
      resources: {
        include: {
          resource: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Transform the data to ensure non-null values and correct types
  return pathways.map(pathway => ({
    ...pathway,
    createdBy: {
      name: pathway.createdBy.name || 'Anonymous',
      image: pathway.createdBy.image || '/default-avatar.png'
    },
    resources: pathway.resources.map(resource => ({
      ...resource,
      notes: resource.notes || undefined // Convert null to undefined to match the component type
    }))
  }))
}

function PathwaysSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-[600px] flex items-center justify-center">
        <Skeleton className="h-6 w-64" />
      </div>
    </div>
  )
}

export default async function PathwaysPage() {
  const pathways = await getPathways()

  return (
    <Suspense fallback={<PathwaysSkeleton />}>
      <PathwaysClient pathways={pathways} />
    </Suspense>
  )
} 