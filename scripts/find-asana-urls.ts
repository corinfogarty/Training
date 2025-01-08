import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findUrls() {
  try {
    // First, let's see how many resources we have total
    const totalCount = await prisma.resource.count()
    console.log(`Total resources in database: ${totalCount}`)

    // Get a sample of resources to see what URLs look like
    const resources = await prisma.resource.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        additionalUrls: true
      }
    })

    console.log('\nSample of resources:')
    for (const resource of resources) {
      console.log('\n-------------------')
      console.log(`Title: ${resource.title}`)
      console.log(`URL: ${resource.url}`)
      console.log('Additional URLs:', resource.additionalUrls)
      console.log('Description excerpt:')
      console.log(resource.description.slice(0, 200) + '...')
    }

    // Look for any URLs in descriptions
    const urlPattern = /https?:\/\/[^\s"')]+/g
    let allUrls = new Set<string>()

    const resourcesWithUrls = await prisma.resource.findMany({
      where: {
        OR: [
          { description: { contains: 'http' } },
          { url: { contains: 'http' } }
        ]
      },
      select: {
        description: true,
        url: true
      }
    })

    resourcesWithUrls.forEach(resource => {
      const urlsInDesc = resource.description.match(urlPattern) || []
      urlsInDesc.forEach(url => allUrls.add(url))
      if (resource.url.startsWith('http')) {
        allUrls.add(resource.url)
      }
    })

    console.log('\nUnique URLs found:')
    Array.from(allUrls).forEach(url => {
      console.log(url)
    })

  } catch (error) {
    console.error('Error searching database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

findUrls()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 