import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Only allow admins to view other users' progress
    if (userId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all pathways with their resources and completion status
    const pathways = await prisma.pathway.findMany({
      where: {
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        resources: {
          select: {
            resource: {
              select: {
                id: true,
                completedBy: {
                  where: {
                    id: userId
                  },
                  select: {
                    id: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // Calculate progress for each pathway
    const pathwayProgress = pathways.map(pathway => {
      const totalResources = pathway.resources.length
      const completedResources = pathway.resources.reduce((sum, pr) => {
        return sum + (pr.resource.completedBy.length > 0 ? 1 : 0)
      }, 0)

      return {
        id: pathway.id,
        title: pathway.title,
        description: pathway.description,
        totalResources,
        completedResources,
        progress: totalResources > 0 ? (completedResources / totalResources) * 100 : 0
      }
    })

    return NextResponse.json(pathwayProgress)
  } catch (error) {
    console.error('Error fetching pathway progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pathway progress' },
      { status: 500 }
    )
  }
} 