import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { lastLogin: new Date() }
    })

    return new NextResponse("Updated", { status: 200 })
  } catch (error) {
    console.error("Error updating lastLogin:", error)
    return new NextResponse("Error", { status: 500 })
  }
} 