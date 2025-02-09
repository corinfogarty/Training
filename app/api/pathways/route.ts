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

    if (!title || !description || !Array.isArray(resources)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const pathway = await prisma.pathway.create({
      data: {
        title,
        description,
        createdById: session.user.id,
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
    console.error('Error creating pathway:', error)
    return NextResponse.json({ error: 'Failed to create pathway' }, { status: 500 })
  }
} 