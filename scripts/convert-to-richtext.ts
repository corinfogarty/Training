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

function convertToRichText(text: string): string {
  // Split into paragraphs
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim())

  // Convert URLs to links
  const urlRegex = /(https?:\/\/[^\s<>"]+)(?![^<>]*>|[^<>]*<\/)/g
  
  // Process each paragraph
  const htmlParagraphs = paragraphs.map(p => {
    let content = p.trim()

    // Skip if it's just dashes
    if (content.match(/^-+$/)) return ''

    // Convert URLs to links
    content = content.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)

    // Check if it's a heading (e.g., "About This Class")
    if (content.length < 50 && !content.includes('.')) {
      return `<h4>${content}</h4>`
    }

    // Check if it's a bullet point
    if (content.startsWith('•') || content.startsWith('-')) {
      return `<li>${content.substring(1).trim()}</li>`
    }

    return `<p>${content}</p>`
  })

  // Wrap lists in ul tags
  let html = ''
  let inList = false

  htmlParagraphs.forEach(p => {
    if (p.startsWith('<li>') && !inList) {
      html += '<ul>'
      inList = true
    } else if (!p.startsWith('<li>') && inList) {
      html += '</ul>'
      inList = false
    }
    html += p
  })

  if (inList) html += '</ul>'

  return html
}

async function convertResources() {
  try {
    const resources = await prisma.resource.findMany()
    console.log(`Found ${resources.length} resources to convert`)

    for (const resource of resources) {
      console.log(`\nConverting: ${resource.title}`)
      
      try {
        const content: FormattedContent = JSON.parse(resource.description)
        
        // Convert the plain text description to rich text
        const richTextDescription = convertToRichText(content.description)
        
        // Update the content object
        const updatedContent = {
          ...content,
          description: richTextDescription
        }

        // Update the resource
        await prisma.resource.update({
          where: { id: resource.id },
          data: {
            description: JSON.stringify(updatedContent, null, 2)
          }
        })

        console.log('✓ Converted successfully')
      } catch (error) {
        console.error(`Error processing resource ${resource.title}:`, error)
      }
    }

    console.log('\nConversion complete!')
  } catch (error) {
    console.error('Error converting resources:', error)
  } finally {
    await prisma.$disconnect()
  }
}

convertResources()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 