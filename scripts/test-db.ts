import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const count = await prisma.category.count()
    console.log('Category count:', count)
    
    // Test category query
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        defaultImage: true,
        order: true,
        resources: {
          select: {
            id: true
          }
        }
      }
    })
    console.log('Categories:', categories)
    
    console.log('Database connection successful!')
  } catch (error) {
    console.error('Database connection failed:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
  .catch(console.error)
  .finally(() => process.exit(0)) 