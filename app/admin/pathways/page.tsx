import { prisma } from '@/lib/prisma'
import AdminPathways from '@/components/admin/AdminPathways'

async function getPathways() {
  const pathways = await prisma.pathway.findMany({
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

  return pathways
}

async function getResources() {
  const resources = await prisma.resource.findMany({
    orderBy: {
      title: 'asc'
    }
  })

  return resources
}

export default async function AdminPathwaysPage() {
  const [pathways, resources] = await Promise.all([
    getPathways(),
    getResources()
  ])

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Manage Pathways</h1>
      <AdminPathways pathways={pathways} resources={resources} />
    </div>
  )
} 