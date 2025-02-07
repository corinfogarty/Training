import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import type { Category, Resource } from '@prisma/client'

interface ResourceGroup {
  categoryId: string
  _count: {
    _all: number
  }
}

interface ResourceWithCategory extends Pick<Resource, 'id' | 'categoryId'> {}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return new NextResponse('Missing userId', { status: 400 })
  }

  try {
    // Get all categories
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    })

    // Get all resources for each category
    const resourcesByCategory = await prisma.resource.groupBy({
      by: ['categoryId'],
      _count: {
        _all: true
      }
    })

    // Get user's completed resources
    const completedResources = await prisma.resource.findMany({
      where: {
        completedBy: {
          some: {
            id: userId
          }
        }
      },
      select: {
        id: true,
        categoryId: true
      }
    })

    // Get user's favorite resources
    const favoriteResources = await prisma.resource.findMany({
      where: {
        favoritedBy: {
          some: {
            id: userId
          }
        }
      },
      select: {
        id: true,
        categoryId: true
      }
    })

    // Build progress data
    const progress = categories.map((category: Category) => {
      const totalResources = resourcesByCategory.find((r: ResourceGroup) => r.categoryId === category.id)?._count._all || 0
      const completedCount = completedResources.filter((r: ResourceWithCategory) => r.categoryId === category.id).length
      const favoriteCount = favoriteResources.filter((r: ResourceWithCategory) => r.categoryId === category.id).length

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        totalResources,
        completedResources: completedCount,
        favoriteResources: favoriteCount
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 