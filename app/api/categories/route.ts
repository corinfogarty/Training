import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { resources: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        defaultImage: data.defaultImage
      }
    })
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error creating category:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 