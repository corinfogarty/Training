import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { categories } = await request.json()

    // Update each category's order in a transaction
    await prisma.$transaction(
      categories.map(({ id, order }: { id: string; order: number }) =>
        prisma.category.update({
          where: { id },
          data: { order }
        })
      )
    )

    const updatedCategories = await prisma.category.findMany({
      include: {
        resources: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(updatedCategories)
  } catch (error) {
    console.error('Error reordering categories:', error)
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    )
  }
} 