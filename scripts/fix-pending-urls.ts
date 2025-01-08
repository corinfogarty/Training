import { prisma } from '../lib/prisma'

async function main() {
  console.log('Fetching all resources with pending URLs...')
  
  const resources = await prisma.resource.findMany({
    where: {
      url: '#pending'
    }
  })
  
  console.log(`Found ${resources.length} resources with pending URLs`)
  let updatedCount = 0
  
  for (const resource of resources) {
    console.log(`\nProcessing "${resource.title}"...`)
    
    if (resource.additionalUrls.length > 0) {
      // Use the first URL as the main URL
      const mainUrl = resource.additionalUrls[0]
      const remainingUrls = resource.additionalUrls.slice(1)
      
      await prisma.resource.update({
        where: { id: resource.id },
        data: {
          url: mainUrl,
          additionalUrls: remainingUrls
        }
      })
      
      console.log('- Updated main URL:', mainUrl)
      if (remainingUrls.length > 0) {
        console.log('- Remaining additional URLs:', remainingUrls)
      }
      updatedCount++
    } else {
      console.log('- No URLs available')
    }
  }
  
  console.log(`\nCompleted! Updated ${updatedCount} resources`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 