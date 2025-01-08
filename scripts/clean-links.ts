import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface FormattedContent {
  title: string
  description: string
  credentials: {
    username?: string
    password?: string
  }
  courseContent?: string[]
  previewImage?: string
  url?: string
}

async function cleanLinks() {
  try {
    // Find resources with invalid URLs
    const invalidResources = await prisma.resource.findMany({
      where: {
        OR: [
          { url: '#' },
          { url: { contains: 'app.asana.com' } },
          { url: 'NEW' },
          { url: '#pending' }
        ]
      },
      include: {
        category: true
      }
    })

    console.log(`Found ${invalidResources.length} resources with invalid links`)

    for (const resource of invalidResources) {
      console.log(`\nCleaning: ${resource.title} (${resource.url})`)
      console.log(`Category: ${resource.category.name}`)

      try {
        const content: FormattedContent = JSON.parse(resource.description)

        // Extract original URL from description if it exists
        const originalUrl = content.description.match(/Original URL: (.*?)(\n|$)/)?.[1]

        // Clean description by removing only URLs and Original URL line
        const cleanDescription = content.description
          .replace(/Original URL: .*(\n|$)/g, '')
          .replace(/(https?:\/\/[^\s<>"]+)(?![^<>]*>|[^<>]*<\/)/g, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim()

        // Update the content object
        const updatedContent = {
          ...content,
          description: cleanDescription
        }

        // Update the resource
        await prisma.resource.update({
          where: { id: resource.id },
          data: {
            url: originalUrl && originalUrl !== '#' && !originalUrl.includes('app.asana.com') && originalUrl !== 'NEW'
              ? originalUrl  // Use original URL if valid
              : '#pending',  // Otherwise mark as pending
            description: JSON.stringify(updatedContent, null, 2)
          }
        })

        console.log('✓ Cleaned successfully')
        if (originalUrl) {
          console.log(`✓ Updated URL: ${originalUrl}`)
        } else {
          console.log('✓ Marked as pending')
        }
      } catch (error) {
        console.error(`Error processing resource ${resource.title}:`, error)
      }
    }

    console.log('\nCleaning complete!')
  } catch (error) {
    console.error('Error cleaning resources:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanLinks()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 