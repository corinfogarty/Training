import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pathway = await prisma.pathway.findUnique({
      where: { 
        id: params.id,
        isPublished: true
      },
      include: {
        createdBy: {
          select: {
            name: true,
            image: true
          }
        },
        resources: {
          include: {
            resource: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!pathway) {
      return NextResponse.json({ error: 'Pathway not found' }, { status: 404 })
    }

    return NextResponse.json(pathway)
  } catch (error) {
    console.error('Error fetching pathway:', error)
    return NextResponse.json({ error: 'Failed to fetch pathway' }, { status: 500 })
  }
} 