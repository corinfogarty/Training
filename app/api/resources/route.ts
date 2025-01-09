import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { ResourceType } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        favoritedBy: true,
        completedBy: true
      }
    })
    return NextResponse.json(resources || [])
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to fetch resources'
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.url || !data.type || !data.categoryId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate resource type
    if (!Object.values(ResourceType).includes(data.type)) {
      return NextResponse.json(
        { error: 'Invalid resource type' },
        { status: 400 }
      )
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // If no preview image is provided, try to use category's default image
    const previewImage = data.previewImage || category.defaultImage || null

    const resource = await prisma.resource.create({ 
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        type: data.type,
        categoryId: data.categoryId,
        previewImage
      } 
    })

    return NextResponse.json(resource)
  } catch (err) {
    console.error('Error creating resource:', err)
    const error = err instanceof Error ? err.message : 'Failed to create resource'
    return NextResponse.json({ error }, { status: 500 })
  }
} 