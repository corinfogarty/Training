import { prisma } from '../prisma'

export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })
} 