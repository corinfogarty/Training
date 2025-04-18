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
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          completed: {
            select: {
              id: true,
              title: true,
              contentType: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }).then(user => user?.completed || []),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          favorites: {
            select: {
              id: true,
              title: true,
              contentType: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }).then(user => user?.favorites || []),
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
          contentType: true,
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