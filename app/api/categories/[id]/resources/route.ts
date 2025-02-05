import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Resource } from '@prisma/client'

interface ResourceWithRelations extends Resource {
  favoritedBy: { id: string }[];
  completedBy: { id: string }[];
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categoryId = request.nextUrl.pathname.split('/')[3] // /api/categories/[id]/resources
    const resources = await prisma.resource.findMany({
      where: {
        categoryId
      },
      include: {
        favoritedBy: {
          where: { id: session.user.id },
          select: { id: true }
        },
        completedBy: {
          where: { id: session.user.id },
          select: { id: true }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Transform the response to include boolean flags
    const transformedResources = (resources as ResourceWithRelations[]).map(resource => ({
      ...resource,
      isFavorite: resource.favoritedBy.length > 0,
      isCompleted: resource.completedBy.length > 0,
      // Remove the arrays since we've transformed them to booleans
      favoritedBy: undefined,
      completedBy: undefined
    }))

    return NextResponse.json(transformedResources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 