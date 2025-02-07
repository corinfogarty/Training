import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Get all users with Google accounts
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          where: { provider: 'google' }
        }
      }
    })

    const updates = await Promise.all(users.map(async (user) => {
      const googleAccount = user.accounts[0]
      if (!googleAccount?.access_token) return null

      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${googleAccount.access_token}`
          }
        })

        if (!response.ok) return null

        const profile = await response.json()
        if (profile.picture && profile.picture !== user.image) {
          return prisma.user.update({
            where: { id: user.id },
            data: { image: profile.picture }
          })
        }
      } catch (error) {
        console.error(`Failed to update profile for user ${user.id}:`, error)
      }
      return null
    }))

    const updatedCount = updates.filter(Boolean).length

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updatedCount} user profiles` 
    })
  } catch (error) {
    console.error('Error updating user profiles:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 