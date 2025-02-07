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
      include: { completed: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const resourceId = request.nextUrl.pathname.split('/')[3] // /api/resources/[id]/complete
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: { completedBy: true }
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    const isCompleted = resource.completedBy.some(u => u.id === user.id)

    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        completedBy: {
          [isCompleted ? 'disconnect' : 'connect']: { id: user.id }
        }
      },
      include: {
        completedBy: {
          select: { id: true }
        }
      }
    })

    // Return the new state
    return NextResponse.json({ 
      isCompleted: !isCompleted,
      completedBy: updatedResource.completedBy
    })
  } catch (err) {
    console.error('Error toggling complete:', err)
    return NextResponse.json(
      { error: 'Failed to toggle complete' },
      { status: 500 }
    )
  }
} 