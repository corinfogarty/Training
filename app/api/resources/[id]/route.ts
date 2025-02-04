import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ContentType } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.url || !data.categoryId || !data.contentType) {
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

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        contentType: data.contentType,
        categoryId: data.categoryId,
        previewImage: data.previewImage || null,
        additionalUrls: data.additionalUrls || []
      }
    })

    return NextResponse.json(resource)
  } catch (err) {
    console.error('Error updating resource:', err)
    const error = err instanceof Error ? err.message : 'Failed to update resource'
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete related records first
    await prisma.$transaction([
      prisma.resourceOrder.deleteMany({
        where: { resourceId: params.id }
      }),
      prisma.resource.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
} 