import { db } from "@/lib/db"

export async function getAllUsers() {
  return await db.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })
} 