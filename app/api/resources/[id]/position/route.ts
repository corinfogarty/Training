import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { categoryId, order } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update or create the resource order
    await prisma.resourceOrder.upsert({
      where: {
        userId_resourceId: {
          userId: user.id,
          resourceId: params.id
        }
      },
      update: {
        categoryId,
        order
      },
      create: {
        userId: user.id,
        resourceId: params.id,
        categoryId,
        order
      }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error updating resource position:', err)
    return NextResponse.json(
      { error: 'Failed to update resource position' },
      { status: 500 }
    )
  }
} 