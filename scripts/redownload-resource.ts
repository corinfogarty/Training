import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'previews')
const FALLBACK_DIR = path.join(process.cwd(), 'public', 'images', 'fallbacks')
const MIN_IMAGE_SIZE = 1000 // Minimum acceptable image size in bytes

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

async function downloadImage(url: string, filename: string): Promise<string> {
  try {
    const initialResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': url
      },
      redirect: 'follow'
    })

    if (!initialResponse.ok) {
      throw new Error(`Failed to fetch image: ${initialResponse.statusText}`)
    }

    const buffer = await initialResponse.buffer()
    
    // Check if image size is too small
    if (buffer.length < MIN_IMAGE_SIZE) {
      console.log(`Warning: Downloaded image is only ${buffer.length} bytes - likely invalid`)
      return ''
    }

    const ext = 'png'
    const finalFilename = `${filename}.${ext}`
    const localPath = path.join(ASSETS_DIR, finalFilename)
    await fs.writeFile(localPath, buffer)

    const stats = await fs.stat(localPath)
    console.log(`Downloaded ${stats.size} bytes for ${finalFilename}`)

    return `/assets/previews/${finalFilename}`
  } catch (error) {
    console.error(`Failed to download image:`, error)
    return ''
  }
}

async function redownload() {
  const resourceId = 'cm6qp60xj0022mliz03tp0pvh'
  
  try {
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
    console.log('URL:', resource.url)

    // Try to download the image
    const previewUrl = 'https://www.cgfasttrack.com/assets/images/logo.png'
    console.log('Preview URL:', previewUrl)

    const filename = `resource-${resourceId}-preview`
    let localPath = await downloadImage(previewUrl, filename)

    // If download failed or image too small, use fallback
    if (!localPath) {
      console.log('Using fallback image due to failed download or small image size')
      const fallbackImage = resource.category?.name?.toLowerCase().includes('blender') ? 'blender.png' : 'default.png'
      localPath = await copyFallbackImage(fallbackImage, resourceId)
    }

    if (localPath) {
      await prisma.resource.update({
        where: { id: resourceId },
        data: { previewImage: localPath }
      })
      console.log('Updated preview image path:', localPath)
    } else {
      console.log('Failed to set preview image')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

redownload()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 