import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const settings = await prisma.settings.findFirst()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const data = await request.json()
    
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data
      }
    })
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 