import fs from 'fs/promises'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'previews')
const DEFAULTS_DIR = path.join(process.cwd(), 'public', 'defaults')

function getFallbackImage(title: string = '', categoryName: string = ''): string {
  const lowerTitle = title.toLowerCase()
  const lowerCategory = categoryName.toLowerCase()

  if (lowerCategory.includes('blender') || lowerTitle.includes('blender')) {
    return 'blender.png'
  }
  if (lowerTitle.includes('figma') || lowerCategory.includes('figma')) {
    return 'figma.png'
  }
  if (lowerTitle.includes('photoshop') || lowerCategory.includes('photoshop')) {
    return 'photoshop.png'
  }
  if (lowerTitle.includes('illustrator') || lowerCategory.includes('illustrator')) {
    return 'illustrator.png'
  }
  if (lowerTitle.includes('indesign') || lowerCategory.includes('indesign')) {
    return 'InDesign.png'
  }
  if (lowerTitle.includes('after effects') || lowerCategory.includes('after effects') || lowerTitle.includes('aftereffects')) {
    return 'aftereffects.png'
  }

  return 'default.png'
}

async function copyFallbackImage(fallbackImage: string, resourceId: string): Promise<string> {
  const sourcePath = path.join(DEFAULTS_DIR, fallbackImage)
  const filename = `resource-${resourceId}-preview.${fallbackImage.split('.').pop()}`
  const targetPath = path.join(ASSETS_DIR, filename)

  try {
    await fs.copyFile(sourcePath, targetPath)
    return `/assets/previews/${filename}`
  } catch (error) {
    console.error(`Failed to copy fallback image ${fallbackImage}:`, error)
    return ''
  }
}

async function checkAndFixImages() {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        category: true
      }
    })

    console.log(`Checking ${resources.length} resources for small images...`)
    let fixedCount = 0

    for (const resource of resources) {
      if (!resource.previewImage) {
        console.log(`Resource ${resource.id} has no preview image, skipping`)
        continue
      }

      const localPath = path.join(process.cwd(), 'public', resource.previewImage)
      
      try {
        const stats = await fs.stat(localPath)
        
        if (stats.size < 50000) { // Increased minimum size since defaults are larger
          console.log(`\nFound small image for resource "${resource.title}"`)
          console.log(`Current size: ${stats.size} bytes`)
          console.log(`Path: ${localPath}`)

          // Use appropriate fallback based on title and category
          const fallbackImage = getFallbackImage(resource.title, resource.category?.name)
          console.log(`Using fallback: ${fallbackImage}`)

          const newPath = await copyFallbackImage(fallbackImage, resource.id)
          
          if (newPath) {
            await prisma.resource.update({
              where: { id: resource.id },
              data: { previewImage: newPath }
            })
            console.log('Successfully replaced with fallback image')
            fixedCount++
          }
        }
      } catch (error) {
        console.error(`Error checking ${resource.id}:`, error)
      }
    }

    console.log(`\nFixed ${fixedCount} small images`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndFixImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 