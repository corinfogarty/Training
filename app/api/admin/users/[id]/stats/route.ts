import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const userId = params.id
    const [completed, favorites, added] = await Promise.all([
      prisma.resource.findMany({
        where: {
          completedBy: {
            some: {
              id: userId
            }
          }
        },
        select: {
          id: true,
          title: true,
          type: true,
          category: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.resource.findMany({
        where: {
          favoritedBy: {
            some: {
              id: userId
            }
          }
        },
        select: {
          id: true,
          title: true,
          type: true,
          category: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.resource.findMany({
        where: {
          orders: {
            some: {
              userId: userId
            }
          }
        },
        select: {
          id: true,
          title: true,
          type: true,
          category: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    return NextResponse.json({
      completed,
      favorites,
      added
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 