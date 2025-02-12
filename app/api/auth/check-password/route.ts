import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hashedPassword: true }
    })

    return NextResponse.json({ hasPassword: !!user?.hashedPassword })
  } catch (error) {
    console.error('Error checking password:', error)
    return NextResponse.json(
      { error: 'Failed to check password' },
      { status: 500 }
    )
  }
} 