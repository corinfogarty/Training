import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; resourceId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if pathway exists and user has permission
    const pathway = await prisma.pathway.findUnique({
      where: { id: params.id },
      include: { createdBy: true }
    })

    if (!pathway) {
      return NextResponse.json({ error: 'Pathway not found' }, { status: 404 })
    }

    if (pathway.createdBy.id !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the PathwayResource to delete
    const pathwayResource = await prisma.pathwayResource.findFirst({
      where: {
        pathwayId: params.id,
        resourceId: params.resourceId
      }
    })

    if (!pathwayResource) {
      return NextResponse.json({ error: 'Resource not found in pathway' }, { status: 404 })
    }

    // Remove resource from pathway
    await prisma.pathwayResource.delete({
      where: {
        id: pathwayResource.id
      }
    })

    // Return updated pathway with remaining resources
    const updatedPathway = await prisma.pathway.findUnique({
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
            resource: {
              include: {
                category: true,
                submittedBy: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                  }
                }
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json(updatedPathway)
  } catch (error) {
    console.error('Error removing resource from pathway:', error)
    return NextResponse.json({ error: 'Failed to remove resource' }, { status: 500 })
  }
} 