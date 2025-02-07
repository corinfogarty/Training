import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const settings = await prisma.settings.findFirst()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const settings = await prisma.settings.upsert({
      where: { id: data.id || 1 },
      update: {
        siteName: data.siteName,
        defaultCategoryId: data.defaultCategoryId,
        notificationEmail: data.notificationEmail,
        emailEnabled: data.emailEnabled
      },
      create: {
        siteName: data.siteName,
        defaultCategoryId: data.defaultCategoryId,
        notificationEmail: data.notificationEmail,
        emailEnabled: data.emailEnabled
      }
    })
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 