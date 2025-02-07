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

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        lastLogin: true,
        isAdmin: session.user.isAdmin, // Only include isAdmin field if user is admin
        _count: {
          select: {
            submittedResources: true,
            favorites: true,
            completed: true
          }
        }
      }
    })

    // If user is not admin, filter out sensitive information
    if (!session.user.isAdmin) {
      return NextResponse.json(users.map(user => ({
        ...user,
        email: user.email.split('@')[0] + '@...' // Mask email addresses for non-admins
      })))
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // TODO: Implement user creation if needed
  return new NextResponse('Not implemented', { status: 501 })
} 