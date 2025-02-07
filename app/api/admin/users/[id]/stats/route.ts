import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        submittedResources: {
          include: {
            category: true
          }
        },
        favorites: {
          include: {
            category: true
          }
        },
        completed: {
          include: {
            category: true,
            completions: {
              where: {
                userId: userId
              },
              select: {
                completedAt: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const stats = {
      submitted: {
        count: user.submittedResources.length,
        resources: user.submittedResources.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category.name,
          createdAt: r.createdAt
        }))
      },
      favorited: {
        count: user.favorites.length,
        resources: user.favorites.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category.name
        }))
      },
      completed: {
        count: user.completed.length,
        resources: user.completed.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category.name,
          completedAt: r.completions[0]?.completedAt
        }))
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 