import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        resources: {
          select: {
            id: true,
            favoritedBy: {
              where: {
                id: session.user.id
              }
            },
            completedBy: {
              where: {
                id: session.user.id
              }
            }
          }
        },
        _count: {
          select: {
            resources: true
          }
        }
      }
    })

    const progress = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      totalResources: category._count.resources,
      completedResources: category.resources.filter(r => r.completedBy.length > 0).length,
      favoriteResources: category.resources.filter(r => r.favoritedBy.length > 0).length
    }))

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 