import { prisma } from '../lib/prisma'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

function getYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v')
    } else if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1)
    }
    return null
  } catch {
    return null
  }
}

function getFigmaFileId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (!urlObj.hostname.includes('figma.com')) return null
    
    // Handle community URLs
    if (url.includes('community/file/')) {
      const matches = url.match(/community\/file\/([^/]+)/)
      return matches?.[1] || null
    }
    
    // Handle direct file URLs
    if (url.includes('file/')) {
      const matches = url.match(/file\/([^/]+)/)
      return matches?.[1] || null
    }
    
    return null
  } catch {
    return null
  }
}

async function getSiteImage(url: string): Promise<string | null> {
  try {
    // Skip invalid URLs
    if (!url || url === '#pending' || !url.startsWith('http')) {
      return null
    }

    // Check for YouTube videos first
    const youtubeId = getYouTubeId(url)
    if (youtubeId) {
      return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
    }

    // Check for Figma files
    const figmaFileId = getFigmaFileId(url)
    if (figmaFileId) {
      return `https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/${figmaFileId}`
    }

    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    // Try to find og:image first
    const ogImage = $('meta[property="og:image"]').attr('content')
    if (ogImage) return ogImage

    // Try to find twitter:image
    const twitterImage = $('meta[name="twitter:image"]').attr('content')
    if (twitterImage) return twitterImage

    return null
  } catch (error) {
    console.error(`Error fetching site image for ${url}:`, error)
    return null
  }
}

async function main() {
  console.log('Fetching all resources...')
  
  const resources = await prisma.resource.findMany({
    include: {
      category: true
    }
  })
  
  console.log(`Found ${resources.length} resources`)
  let updatedCount = 0
  
  // Default images for categories (only used as fallback)
  const defaultImages: Record<string, string> = {
    'BLENDER': 'https://download.blender.org/branding/blender_logo_socket.png',
    'FIGMA': 'https://static.figma.com/app/icon/1/icon-192.png',
    'ILLUSTRATOR': 'https://www.adobe.com/content/dam/cc/icons/illustrator.svg',
    'PHOTOSHOP': 'https://www.adobe.com/content/dam/cc/us/en/creativecloud/ps_cc_app_RGB.svg',
    'INDESIGN': 'https://www.adobe.com/content/dam/cc/icons/indesign.svg',
    'AFTER EFFECTS': 'https://www.adobe.com/content/dam/cc/icons/aftereffects.svg'
  }
  
  for (const resource of resources) {
    console.log(`\nProcessing "${resource.title}"...`)
    
    let previewImage = null
    let allUrls = [resource.url]
    
    // Add additional URLs if they exist
    if (resource.additionalUrls?.length > 0) {
      allUrls = allUrls.concat(resource.additionalUrls)
    }
    
    // Try to get preview image from any of the URLs
    for (const url of allUrls) {
      if (!url) continue
      
      previewImage = await getSiteImage(url)
      if (previewImage) {
        console.log('- Found preview image from URL:', url)
        console.log('- Image:', previewImage)
        break
      }
    }
    
    // If no preview found from any URL, use category default as fallback
    if (!previewImage && resource.category) {
      const defaultImage = defaultImages[resource.category.name]
      if (defaultImage) {
        previewImage = defaultImage
        console.log('- No preview images found, using category default:', defaultImage)
      }
    }
    
    if (previewImage) {
      // Make sure the URL is absolute
      if (previewImage.startsWith('//')) {
        previewImage = 'https:' + previewImage
      } else if (previewImage.startsWith('/')) {
        try {
          const urlObj = new URL(resource.url)
          previewImage = urlObj.origin + previewImage
        } catch {
          // If we can't parse the URL, just skip this fix
        }
      }
      
      await prisma.resource.update({
        where: { id: resource.id },
        data: { previewImage }
      })
      
      console.log(`- Updated with image:`, previewImage)
      updatedCount++
    } else {
      console.log('- No preview image found')
    }
  }
  
  console.log(`\nCompleted! Updated ${updatedCount} resources`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 