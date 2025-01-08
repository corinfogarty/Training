import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDatabase() {
  try {
    // Find all resources with invalid URLs
    const invalidResources = await prisma.resource.findMany({
      where: {
        OR: [
          { url: 'NEW' },
          { url: '#pending' },
          { url: '#' },
          { url: '' }
          // Can't use null in Prisma query for non-nullable field
        ]
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    console.log(`Found ${invalidResources.length} resources with invalid links`)
    
    // Update them in a transaction
    await prisma.$transaction(async (tx) => {
      for (const resource of invalidResources) {
        console.log(`\nUpdating: ${resource.title} (${resource.url})`)
        console.log(`Category: ${resource.category.name}`)

        try {
          // Extract any valid URLs from description
          const urlRegex = /(https?:\/\/[^\s]+)/g
          const urls = resource.description?.match(urlRegex) || []
          const validUrl = urls.find(url => 
            url && 
            !url.includes('app.asana.com') && 
            url !== '#' && 
            url !== '#pending' && 
            url !== 'NEW'
          )

          // Update the resource
          await tx.resource.update({
            where: { id: resource.id },
            data: {
              url: validUrl || '', // Use first valid URL found or empty string
              previewImage: null   // Clear preview image to be regenerated
            }
          })

          console.log(validUrl ? 
            `✓ Updated with URL: ${validUrl}` : 
            '✓ Cleared invalid URL'
          )
        } catch (err) {
          console.error(`Failed to update ${resource.title}:`, err)
        }
      }
    })

    console.log('\nCleanup complete!')
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 