import { db } from "@/lib/db"

export async function getAllCategories() {
  return await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })
} 