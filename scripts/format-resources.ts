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

function parseContent(description: string): FormattedContent {
  const content: FormattedContent = {
    title: '',
    description: '',
    credentials: {
      username: undefined,
      password: undefined
    }
  }

  // Extract username/password
  const usernameMatch = description.match(/username:?\s*([^\n]+)/i)
  const passwordMatch = description.match(/pass(?:word)?:?\s*([^\n]+)/i)
  if (usernameMatch) {
    content.credentials.username = usernameMatch[1].trim()
  }
  if (passwordMatch) {
    content.credentials.password = passwordMatch[1].trim()
  }

  // Extract course content (bullet points)
  const bulletPoints = description
    .split('\n')
    .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
    .map(line => line.replace(/^[•-]\s*/, '').trim())

  if (bulletPoints.length > 0) {
    content.courseContent = bulletPoints
  }

  // Clean up description - remove credentials, bullet points, and asset URLs
  let cleanDescription = description
    .split('\n')
    .filter(line => 
      !line.match(/username|password|pass:/i) && 
      !line.trim().startsWith('•') && 
      !line.trim().startsWith('-') &&
      !line.includes('/assets/') && // Remove asset URLs
      !line.match(/https:\/\/app\.asana\.com\/app\/asana\/-\/get_asset\?/) // Remove Asana asset URLs
    )
    .join('\n')
    .trim()

  // Remove any remaining asset URLs that might be inline
  cleanDescription = cleanDescription
    .replace(/\/assets\/[^\s"')]+/g, '') // Remove local asset paths
    .replace(/https:\/\/app\.asana\.com\/app\/asana\/-\/get_asset\?[^\s"')]+/g, '') // Remove Asana asset URLs
    .replace(/\n\n+/g, '\n\n') // Remove extra newlines
    .trim()

  content.description = cleanDescription

  return content
}

async function formatResources() {
  try {
    const resources = await prisma.resource.findMany()
    console.log(`Found ${resources.length} resources to format`)

    for (const resource of resources) {
      console.log(`\nFormatting: ${resource.title}`)
      
      const formatted = parseContent(resource.description)

      // Update the resource with formatted content
      await prisma.resource.update({
        where: { id: resource.id },
        data: {
          description: JSON.stringify(formatted, null, 2) // Store as structured JSON
        }
      })

      console.log('✓ Updated successfully')
    }

    console.log('\nFormatting complete!')
  } catch (error) {
    console.error('Error formatting resources:', error)
  } finally {
    await prisma.$disconnect()
  }
}

formatResources()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 