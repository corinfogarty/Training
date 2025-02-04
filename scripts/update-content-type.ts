import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.resource.updateMany({
      data: {
        contentType: 'Training'
      }
    })
    console.log('Successfully updated all resources to Training content type')
  } catch (error) {
    console.error('Error updating resources:', error)
    process.exit(1)
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  }) 