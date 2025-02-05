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

    const resourceId = request.nextUrl.pathname.split('/')[3] // /api/resources/[id]
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
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...resource,
      isFavorite: resource.favoritedBy.length > 0,
      isCompleted: resource.completedBy.length > 0,
      favoritedBy: undefined,
      completedBy: undefined
    })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resourceId = request.nextUrl.pathname.split('/')[3] // /api/resources/[id]
    const data = await request.json()

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data,
      include: {
        category: true
      }
    })

    return NextResponse.json(resource)
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