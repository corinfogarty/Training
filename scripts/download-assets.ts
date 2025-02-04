import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'previews')
const FALLBACK_DIR = path.join(process.cwd(), 'public', 'images', 'fallbacks')

// Fallback images for sites that block direct access
const FALLBACK_IMAGES: Record<string, string> = {
  'skillshare.com': 'skillshare.png',
  'cgfasttrack.com': 'cgfasttrack.png',
  'figma.com': 'figma.png',
  'motiondesign.school': 'mds.png',
  'adobe.com': 'adobe.png',
  'blender.org': 'blender.png',
  'photoshop.com': 'photoshop.png',
  'aftereffects.com': 'aftereffects.png',
  'illustrator.com': 'illustrator.png',
  'indesign.com': 'indesign.png',
  'cdn.sanity.io': 'default.png'
}

// Category-based fallback images
const CATEGORY_FALLBACKS: Record<string, string> = {
  'BLENDER': 'blender.png',
  'PHOTOSHOP': 'photoshop.png',
  'AFTER EFFECTS': 'aftereffects.png',
  'ILLUSTRATOR': 'illustrator.png',
  'INDESIGN': 'indesign.png',
  'FIGMA': 'figma.png'
}

async function ensureDirectories() {
  try {
    await fs.access(ASSETS_DIR)
  } catch {
    await fs.mkdir(ASSETS_DIR, { recursive: true })
  }
  try {
    await fs.access(FALLBACK_DIR)
  } catch {
    await fs.mkdir(FALLBACK_DIR, { recursive: true })
  }
}

async function copyFallbackImage(fallbackImage: string, resourceId: string): Promise<string> {
  if (!fallbackImage) return ''

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

async function downloadImage(url: string, filename: string, category?: string): Promise<string> {
  try {
    // Check if we should use a fallback image based on URL
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    for (const [domain, fallbackImage] of Object.entries(FALLBACK_IMAGES)) {
      if (hostname.includes(domain)) {
        console.log(`Using fallback image for ${domain}`)
        return await copyFallbackImage(fallbackImage, filename.split('-')[1])
      }
    }

    // Handle YouTube thumbnail URLs directly
    if (hostname.includes('img.youtube.com') || hostname.includes('i.ytimg.com')) {
      const imageResponse = await fetch(url)
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch YouTube image: ${imageResponse.statusText}`)
      }
      const buffer = await imageResponse.buffer()
      const ext = 'jpg'
      const finalFilename = `${filename}.${ext}`
      const localPath = path.join(ASSETS_DIR, finalFilename)
      await fs.writeFile(localPath, buffer)
      return `/assets/previews/${finalFilename}`
    }

    // First request to get potential redirects
    const initialResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.google.com/'
      },
      redirect: 'follow'
    })

    if (!initialResponse.ok) {
      throw new Error(`Failed to fetch image: ${initialResponse.statusText}`)
    }

    // Verify content type
    const contentType = initialResponse.headers.get('content-type')
    if (!contentType?.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}`)
    }

    // Get the correct file extension
    const ext = contentType.split('/')[1].split(';')[0]
    const finalFilename = `${filename}.${ext}`

    // Get the binary data
    const buffer = await initialResponse.buffer()

    // Verify file size
    if (buffer.length < 1000) { // Less than 1KB is probably not a valid image
      throw new Error(`File too small (${buffer.length} bytes)`)
    }

    // Calculate hash to verify file integrity
    const hash = createHash('md5').update(buffer).digest('hex')
    console.log(`File hash: ${hash}`)

    const localPath = path.join(ASSETS_DIR, finalFilename)
    await fs.writeFile(localPath, buffer)

    // Verify the file was written
    const stats = await fs.stat(localPath)
    console.log(`Downloaded ${stats.size} bytes for ${finalFilename}`)

    if (stats.size !== buffer.length) {
      throw new Error('File size mismatch after writing')
    }

    return `/assets/previews/${finalFilename}`
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error)
    
    // Try category fallback if available
    if (category && CATEGORY_FALLBACKS[category]) {
      console.log(`Using category fallback for ${category}`)
      return await copyFallbackImage(CATEGORY_FALLBACKS[category], filename.split('-')[1])
    }
    
    // Use default fallback as last resort
    console.log('Using default fallback image')
    return await copyFallbackImage('default.png', filename.split('-')[1])
  }
}

async function downloadAssets() {
  try {
    await ensureDirectories()

    // First, check for resources with external URLs
    const resources = await prisma.resource.findMany({
      where: {
        OR: [
          { previewImage: { startsWith: 'http' } },
          { previewImage: null },
          { previewImage: '' }
        ]
      },
      include: {
        category: true
      }
    })

    console.log(`Found ${resources.length} resources that need preview images`)

    for (const resource of resources) {
      console.log(`\nProcessing "${resource.title}"`)
      
      let previewImage = null
      const filename = `resource-${resource.id}-preview`

      if (resource.previewImage?.startsWith('http')) {
        console.log(`URL: ${resource.previewImage}`)
        previewImage = await downloadImage(resource.previewImage, filename, resource.category?.name)
      } else if (!resource.previewImage && resource.category?.name) {
        // Try category fallback for resources without preview image
        console.log('No preview image, using category fallback')
        if (CATEGORY_FALLBACKS[resource.category.name]) {
          previewImage = await copyFallbackImage(CATEGORY_FALLBACKS[resource.category.name], resource.id)
        }
      }

      // Use default fallback if nothing else worked
      if (!previewImage) {
        console.log('Using default fallback')
        previewImage = await copyFallbackImage('default.png', resource.id)
      }

      if (previewImage) {
        await prisma.resource.update({
          where: { id: resource.id },
          data: { previewImage }
        })
        console.log('✓ Updated preview image path')
      }
    }

    // Now check for any resources with missing local files
    const localResources = await prisma.resource.findMany({
      where: {
        previewImage: {
          startsWith: '/assets/previews/'
        }
      }
    })

    console.log(`\nChecking ${localResources.length} resources with local preview images`)

    for (const resource of localResources) {
      if (!resource.previewImage) continue

      const localPath = path.join(process.cwd(), 'public', resource.previewImage)
      try {
        await fs.access(localPath)
      } catch {
        console.log(`\nMissing local file for "${resource.title}"`)
        console.log(`Path: ${localPath}`)
        
        // Reset the preview image to trigger re-download
        await prisma.resource.update({
          where: { id: resource.id },
          data: { previewImage: null }
        })
        console.log('Reset preview image path to trigger re-download')
      }
    }

    console.log('\nPreview image download complete!')
  } catch (error) {
    console.error('Error during preview image download:', error)
  } finally {
    await prisma.$disconnect()
  }
}

downloadAssets()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 