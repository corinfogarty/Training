import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user from the database to ensure we have the correct ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const resourceId = request.nextUrl.pathname.split('/')[3] // /api/resources/[id]
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        category: true,
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        favoritedBy: {
          select: { id: true }
        },
        completedBy: {
          select: { id: true }
        }
      }
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...resource,
      isFavorite: resource.favoritedBy.some(u => u.id === user.id),
      isCompleted: resource.completedBy.some(u => u.id === user.id)
    })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resourceId = request.nextUrl.pathname.split('/')[3]
    
    // Check if user is the submitter of this resource
    const existingResource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { submittedById: true }
    })

    if (!existingResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Only allow admins or the original submitter to edit
    if (!session.user.isAdmin && existingResource.submittedById !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        categoryId: data.categoryId,
        previewImage: data.previewImage,
        contentType: data.contentType
      },
      include: {
        category: true,
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        favoritedBy: {
          select: { id: true }
        },
        completedBy: {
          select: { id: true }
        }
      }
    })

    return NextResponse.json({
      ...resource,
      isFavorite: resource.favoritedBy.some(u => u.id === session.user.id),
      isCompleted: resource.completedBy.some(u => u.id === session.user.id)
    })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resourceId = request.nextUrl.pathname.split('/')[3] // /api/resources/[id]
    await prisma.resource.delete({
      where: { id: resourceId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 