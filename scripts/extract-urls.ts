import { prisma } from '../lib/prisma'

// URL regex pattern that matches http/https URLs
const URL_PATTERN = /https?:\/\/[^\s<>[\](){}]+/g

async function main() {
  console.log('Fetching all resources...')
  
  const resources = await prisma.resource.findMany()
  let updatedCount = 0
  
  console.log(`Found ${resources.length} resources`)
  
  for (const resource of resources) {
    // Extract URLs from description
    const urls = resource.description.match(URL_PATTERN) || []
    
    if (urls.length > 0) {
      // Remove URLs from description
      let newDescription = resource.description
      urls.forEach(url => {
        newDescription = newDescription.replace(url, '').trim()
      })
      
      // Add URLs to additionalUrls array, avoiding duplicates
      const existingUrls = new Set(resource.additionalUrls)
      urls.forEach(url => existingUrls.add(url))
      
      // Update the resource
      await prisma.resource.update({
        where: { id: resource.id },
        data: {
          description: newDescription,
          additionalUrls: Array.from(existingUrls)
        }
      })
      
      console.log(`Updated resource "${resource.title}":`)
      console.log('- Extracted URLs:', urls)
      console.log('- New description:', newDescription)
      console.log('---')
      
      updatedCount++
    }
  }
  
  console.log(`\nCompleted! Updated ${updatedCount} resources`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 