import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pathway = await prisma.pathway.findUnique({
      where: { id: params.id },
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
      }
    })

    if (!pathway) {
      return NextResponse.json({ error: 'Pathway not found' }, { status: 404 })
    }

    return NextResponse.json(pathway)
  } catch (error) {
    console.error('Error fetching pathway:', error)
    return NextResponse.json({ error: 'Failed to fetch pathway' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const { title, description, resources, isPublished } = json

    if (!title || !description || !Array.isArray(resources)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Delete existing resources
    await prisma.pathwayResource.deleteMany({
      where: { pathwayId: params.id }
    })

    // Update pathway and create new resources
    const pathway = await prisma.pathway.update({
      where: { id: params.id },
      data: {
        title,
        description,
        isPublished,
        resources: {
          create: resources.map((resource: any, index: number) => ({
            resourceId: resource.id,
            order: index,
            notes: resource.notes
          }))
        }
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
          }
        }
      }
    })

    return NextResponse.json(pathway)
  } catch (error) {
    console.error('Error updating pathway:', error)
    return NextResponse.json({ error: 'Failed to update pathway' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.pathway.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pathway:', error)
    return NextResponse.json({ error: 'Failed to delete pathway' }, { status: 500 })
  }
} 