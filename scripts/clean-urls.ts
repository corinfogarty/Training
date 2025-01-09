import { prisma } from '../lib/prisma'

async function main() {
  console.log('Fetching all resources...')
  
  const resources = await prisma.resource.findMany()
  let updatedCount = 0
  
  console.log(`Found ${resources.length} resources`)
  
  for (const resource of resources) {
    if (resource.additionalUrls && resource.additionalUrls.length > 0) {
      // Clean up URLs by removing escaped quotes and duplicates
      const cleanUrls = Array.from(new Set(
        resource.additionalUrls.map(url => url.replace(/\\"/g, '').trim())
      ))
      
      // Only update if we cleaned any URLs
      if (JSON.stringify(cleanUrls) !== JSON.stringify(resource.additionalUrls)) {
        await prisma.resource.update({
          where: { id: resource.id },
          data: {
            additionalUrls: cleanUrls
          }
        })
        
        console.log(`Updated resource "${resource.title}":`)
        console.log('- Original URLs:', resource.additionalUrls)
        console.log('- Cleaned URLs:', cleanUrls)
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