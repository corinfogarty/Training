import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { ContentType } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        additionalUrls: true,
        contentType: true,
        previewImage: true,
        category: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        favoritedBy: {
          select: {
            id: true
          }
        },
        completedBy: {
          select: {
            id: true
          }
        },
        orders: {
          select: {
            id: true,
            userId: true,
            order: true
          }
        },
        completions: {
          select: {
            id: true,
            userId: true,
            completedAt: true
          }
        }
      }
    })

    // Transform resources to handle description
    const transformedResources = resources.map(resource => {
      let description = resource.description
      try {
        // If it's a JSON string, parse it and get the description field
        const parsed = JSON.parse(description)
        if (parsed && typeof parsed === 'object' && 'description' in parsed) {
          description = parsed.description
        }
      } catch {
        // If it's not valid JSON, use it as is
      }
      return {
        ...resource,
        description
      }
    })

    return NextResponse.json(transformedResources || [])
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to fetch resources'
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.url || !data.categoryId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate content type
    if (!Object.values(ContentType).includes(data.contentType)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
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

    // Handle description - ensure it's a string
    let description = data.description
    if (typeof description === 'object') {
      description = JSON.stringify(description)
    }

    const resource = await prisma.resource.create({ 
      data: {
        title: data.title,
        description,
        url: data.url,
        categoryId: data.categoryId,
        previewImage,
        contentType: data.contentType,
        additionalUrls: data.additionalUrls || [],
        submittedById: session?.user?.id || null
      },
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(resource)
  } catch (err) {
    console.error('Error creating resource:', err)
    const error = err instanceof Error ? err.message : 'Failed to create resource'
    return NextResponse.json({ error }, { status: 500 })
  }
} 