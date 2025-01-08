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

async function getSiteImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    // Try to find og:image first
    const ogImage = $('meta[property="og:image"]').attr('content')
    if (ogImage) return ogImage

    // Try to find twitter:image
    const twitterImage = $('meta[name="twitter:image"]').attr('content')
    if (twitterImage) return twitterImage

    // Try to find the first large image
    const firstLargeImage = $('img[width][height]').filter((_, el) => {
      const $el = $(el)
      const width = parseInt($el.attr('width') || '0')
      const height = parseInt($el.attr('height') || '0')
      return width >= 200 && height >= 200
    }).first().attr('src')
    if (firstLargeImage) return firstLargeImage

    return null
  } catch (error) {
    console.error(`Error fetching site image for ${url}:`, error)
    return null
  }
}

function getDefaultSiteImage(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    // Default images for different sites
    const defaultImages: Record<string, string> = {
      'skillshare.com': 'https://static.skillshare.com/assets/images/opengraph/default-share-image.png',
      'motiondesign.school': 'https://motiondesign.school/wp-content/uploads/2023/05/mds-logo-1.png',
      'cgfasttrack.com': 'https://www.cgfasttrack.com/assets/images/logo.png',
      'figma.com': 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1108x1108.png',
      'drive.google.com': 'https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png',
      'youtube.com': 'https://www.youtube.com/img/desktop/yt_1200.png',
      'youtu.be': 'https://www.youtube.com/img/desktop/yt_1200.png',
      'dropbox.com': 'https://aem.dropbox.com/cms/content/dam/dropbox/www/en-us/branding/dropbox-logo@2x.jpg'
    }

    // Find matching site
    for (const [site, image] of Object.entries(defaultImages)) {
      if (hostname.includes(site)) {
        return image
      }
    }

    return null
  } catch {
    return null
  }
}

async function getPreviewImage(url: string): Promise<string | null> {
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

    // Try to get the site's og:image or other meta images
    const siteImage = await getSiteImage(url)
    if (siteImage) return siteImage

    // Fall back to default site logo/image
    const defaultImage = getDefaultSiteImage(url)
    if (defaultImage) return defaultImage

    return null
  } catch (error) {
    console.error(`Error fetching preview for ${url}:`, error)
    return null
  }
}

async function main() {
  console.log('Fetching all resources...')
  
  const resources = await prisma.resource.findMany({
    where: {
      previewImage: null
    },
    include: {
      category: true
    }
  })
  
  console.log(`Found ${resources.length} resources without preview images`)
  let updatedCount = 0
  
  // Default images for categories
  const categoryDefaultImages: Record<string, string> = {
    'BLENDER': 'https://download.blender.org/branding/blender_logo_socket.png',
    'FIGMA': 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1108x1108.png',
    'ILLUSTRATOR': 'https://www.adobe.com/content/dam/cc/icons/illustrator.svg',
    'PHOTOSHOP': 'https://www.adobe.com/content/dam/cc/us/en/creativecloud/ps_cc_app_RGB.svg',
    'INDESIGN': 'https://www.adobe.com/content/dam/cc/icons/indesign.svg',
    'AFTER EFFECTS': 'https://www.adobe.com/content/dam/cc/icons/aftereffects.svg'
  }
  
  for (const resource of resources) {
    console.log(`\nProcessing "${resource.title}"...`)
    
    let previewImage = null
    
    // Try URLs first
    if (resource.url && resource.url !== '#pending') {
      previewImage = await getPreviewImage(resource.url)
    }
    
    // If no preview found, try additional URLs
    if (!previewImage && resource.additionalUrls.length > 0) {
      for (const url of resource.additionalUrls) {
        previewImage = await getPreviewImage(url)
        if (previewImage) break
      }
    }
    
    // If still no preview found and resource has a category, use category's default image
    if (!previewImage && resource.category) {
      if (resource.category.defaultImage) {
        previewImage = resource.category.defaultImage
        console.log('- Using category default image:', previewImage)
      } else if (categoryDefaultImages[resource.category.name]) {
        previewImage = categoryDefaultImages[resource.category.name]
        console.log(`- Using ${resource.category.name} default image:`, previewImage)
      }
    }
    
    if (previewImage) {
      // Make sure the URL is absolute
      if (previewImage.startsWith('//')) {
        previewImage = 'https:' + previewImage
      } else if (previewImage.startsWith('/')) {
        const urlObj = new URL(resource.url)
        previewImage = urlObj.origin + previewImage
      }
      
      await prisma.resource.update({
        where: { id: resource.id },
        data: { previewImage }
      })
      
      console.log('- Found preview image:', previewImage)
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