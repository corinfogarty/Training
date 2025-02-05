import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

type RouteContext = {
  params: {
    id: string
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { isAdmin } = await request.json()
    
    const user = await prisma.user.update({
      where: { id: context.params.id },
      data: { isAdmin }
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await prisma.user.delete({
      where: { id: context.params.id }
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 