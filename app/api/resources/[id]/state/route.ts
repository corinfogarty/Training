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
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      include: {
        favoritedBy: {
          where: { id: session.user.id },
          select: { id: true }
        },
        completedBy: {
          where: { id: session.user.id },
          select: { id: true }
        },
        completions: {
          where: { userId: session.user.id },
          select: { completedAt: true },
          orderBy: { completedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json({
      isFavorite: resource.favoritedBy.length > 0,
      isCompleted: resource.completedBy.length > 0,
      completedAt: resource.completions[0]?.completedAt
    })
  } catch (error) {
    console.error('Error fetching resource state:', error)
    return NextResponse.json({ error: 'Failed to fetch resource state' }, { status: 500 })
  }
} 