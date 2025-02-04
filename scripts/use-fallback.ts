import fs from 'fs/promises'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'previews')
const FALLBACK_DIR = path.join(process.cwd(), 'public', 'images', 'fallbacks')

async function copyFallbackImage(fallbackImage: string, resourceId: string): Promise<string> {
  const sourcePath = path.join(FALLBACK_DIR, fallbackImage)
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

async function useFallback() {
  const resourceId = 'cm6qp60xj0022mliz03tp0pvh'
  
  try {
    // Ensure assets directory exists
    await fs.mkdir(ASSETS_DIR, { recursive: true })

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        category: true
      }
    })

    if (!resource) {
      console.log('Resource not found')
      return
    }

    console.log('Resource:', resource.title)
    console.log('Category:', resource.category?.name)

    // Use Blender fallback image
    const fallbackImage = 'blender.png'
    console.log('Using fallback image:', fallbackImage)

    const localPath = await copyFallbackImage(fallbackImage, resourceId)

    if (localPath) {
      await prisma.resource.update({
        where: { id: resourceId },
        data: { previewImage: localPath }
      })
      console.log('Updated preview image path:', localPath)
    } else {
      console.log('Failed to copy fallback image')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

useFallback()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 