import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { favorites: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const resourceId = request.nextUrl.pathname.split('/')[3] // /api/resources/[id]/favorite
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: { favoritedBy: true }
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    const isFavorited = resource.favoritedBy.some(u => u.id === user.id)

    if (isFavorited) {
      await prisma.resource.update({
        where: { id: resourceId },
        data: {
          favoritedBy: {
            disconnect: { id: user.id }
          }
        }
      })
    } else {
      await prisma.resource.update({
        where: { id: resourceId },
        data: {
          favoritedBy: {
            connect: { id: user.id }
          }
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error toggling favorite:', err)
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    )
  }
} 