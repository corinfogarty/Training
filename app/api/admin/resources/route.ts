import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const resources = await prisma.resource.findMany({
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
        _count: {
          select: {
            favoritedBy: true,
            completedBy: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        categoryId: data.categoryId,
        submittedById: session.user.id
      },
      include: {
        category: true
      }
    })
    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const resource = await prisma.resource.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        categoryId: data.categoryId
      },
      include: {
        category: true
      }
    })
    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 