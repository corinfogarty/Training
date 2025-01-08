import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, url, type, description, previewImage } = await request.json()

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        title,
        url,
        type,
        description,
        previewImage
      }
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
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
      return new NextResponse('Resource not found', { status: 404 })
    }

    return NextResponse.json({
      ...resource,
      isFavorite: resource.favoritedBy.length > 0,
      isCompleted: resource.completedBy.length > 0
    })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 