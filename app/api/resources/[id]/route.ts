import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resourceId = params.id
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        category: true,
        favoritedBy: {
          where: { id: session.user.id },
          select: { id: true }
        },
        completedBy: {
          where: { id: session.user.id },
          select: { id: true }
        }
      }
    })

    if (!resource) {
      return Response.json({ error: 'Resource not found' }, { status: 404 })
    }

    return Response.json({
      ...resource,
      isFavorite: resource.favoritedBy.length > 0,
      isCompleted: resource.completedBy.length > 0,
      favoritedBy: undefined,
      completedBy: undefined
    })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resourceId = params.id
    const data = await req.json()

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data,
      include: {
        category: true
      }
    })

    return Response.json(resource)
  } catch (error) {
    console.error('Error updating resource:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resourceId = params.id
    await prisma.resource.delete({
      where: { id: resourceId }
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 