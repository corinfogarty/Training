import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, url, type, description, previewImage } = await request.json()

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        title,
        url,
        type,
        description,
        previewImage
      }
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
} 