import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's Google access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google'
      }
    })

    if (!account?.access_token) {
      return NextResponse.json({ error: 'No Google account linked' }, { status: 400 })
    }

    // Fetch latest Google profile
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${account.access_token}`
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch Google profile' }, { status: 500 })
    }

    const googleProfile = await response.json()
    
    // Update user's image
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: googleProfile.picture }
    })

    return NextResponse.json({ image: user.image })
  } catch (error) {
    console.error('Error updating profile image:', error)
    return NextResponse.json({ error: 'Failed to update profile image' }, { status: 500 })
  }
} 