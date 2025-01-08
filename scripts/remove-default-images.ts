import { prisma } from '../lib/prisma'

async function main() {
  console.log('Fetching all resources...')
  
  const resources = await prisma.resource.findMany()
  let updatedCount = 0
  
  console.log(`Found ${resources.length} resources`)
  
  for (const resource of resources) {
    // Check if image is a default image
    if (resource.previewImage?.startsWith('/defaults/')) {
      await prisma.resource.update({
        where: { id: resource.id },
        data: {
          previewImage: null
        }
      })
      
      console.log(`Updated resource "${resource.title}":`)
      console.log('- Removed default preview image:', resource.previewImage)
      console.log('---')
      
      updatedCount++
    }
  }
  
  console.log(`\nCompleted! Updated ${updatedCount} resources`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 