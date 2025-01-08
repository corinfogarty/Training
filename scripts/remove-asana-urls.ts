import { prisma } from '../lib/prisma'

async function main() {
  console.log('Fetching all resources...')
  
  const resources = await prisma.resource.findMany()
  let updatedCount = 0
  
  console.log(`Found ${resources.length} resources`)
  
  for (const resource of resources) {
    if (resource.additionalUrls && resource.additionalUrls.length > 0) {
      // Filter out Asana URLs
      const filteredUrls = resource.additionalUrls.filter(url => !url.includes('app.asana'))
      
      // Only update if we removed any URLs
      if (filteredUrls.length !== resource.additionalUrls.length) {
        await prisma.resource.update({
          where: { id: resource.id },
          data: {
            additionalUrls: filteredUrls
          }
        })
        
        console.log(`Updated resource "${resource.title}":`)
        console.log('- Removed URLs:', resource.additionalUrls.filter(url => url.includes('app.asana')))
        console.log('- Remaining URLs:', filteredUrls)
        console.log('---')
        
        updatedCount++
      }
    }
  }
  
  console.log(`\nCompleted! Updated ${updatedCount} resources`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 