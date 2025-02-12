import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(pathways)
  } catch (error) {
    console.error('Error fetching pathways:', error)
    return NextResponse.json({ error: 'Failed to fetch pathways' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const { title, description, resources } = json

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    // Create pathway without resources first
    const pathway = await prisma.pathway.create({
      data: {
        title,
        description,
        createdById: session.user.id,
        isPublished: true
      }
    })

    // If resources exist, add them
    if (resources && resources.length > 0) {
      await prisma.pathwayResource.createMany({
        data: resources.map((resource: any, index: number) => ({
          pathwayId: pathway.id,
          resourceId: resource.resourceId,
          order: index,
          notes: resource.notes || ''
        }))
      })
    }

    // Fetch the complete pathway with all relations
    const completePathway = await prisma.pathway.findUnique({
      where: { id: pathway.id },
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
          }
        }
      }
    })

    return NextResponse.json(completePathway)
  } catch (error) {
    console.error('Error creating pathway:', error)
    return NextResponse.json({ error: 'Failed to create pathway' }, { status: 500 })
  }
} 