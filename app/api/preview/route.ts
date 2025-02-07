import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

function isValidUrl(urlString: string) {
  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function getAbsoluteUrl(relativeUrl: string, baseUrl: string) {
  try {
    if (!relativeUrl) return null
    
    // Handle protocol-relative URLs
    if (relativeUrl.startsWith('//')) {
      return `https:${relativeUrl}`
    }
    
    // Handle root-relative URLs
    if (relativeUrl.startsWith('/')) {
      const url = new URL(baseUrl)
      return `${url.origin}${relativeUrl}`
    }
    
    // Handle already absolute URLs
    if (relativeUrl.startsWith('http')) {
      return relativeUrl
    }
    
    // Handle relative URLs
    return new URL(relativeUrl, baseUrl).toString()
  } catch (error) {
    console.error('Error converting to absolute URL:', error)
    return null
  }
}

function getYouTubeId(url: string) {
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

function findMetaContent(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }
  return null
}

function getDefaultImage(hostname: string): string | null {
  const defaultImages: Record<string, string> = {
    'youtube.com': 'https://www.youtube.com/img/desktop/yt_1200.png',
    'youtu.be': 'https://www.youtube.com/img/desktop/yt_1200.png',
    'github.com': 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    'linkedin.com': 'https://static.licdn.com/aero-v1/sc/h/3usjoqvsfrr7z3ovwvk8r6mz0',
    'figma.com': '/defaults/figma.png',
    'twitter.com': 'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png',
    'medium.com': 'https://miro.medium.com/v2/1*m-R_BkNf1Qjr1YbyOIJY2w.png',
    'codepen.io': 'https://assets.codepen.io/t-1/codepen-logo.svg',
    'skillshare.com': '/defaults/skillshare.png',
    'cgfasttrack.com': '/defaults/cgfasttrack.png',
    'adobe.com': '/defaults/adobe.png',
    'photoshop.com': '/defaults/photoshop.png',
    'blender.org': '/defaults/blender.png'
  }

  for (const [domain, image] of Object.entries(defaultImages)) {
    if (hostname.includes(domain)) {
      return image
    }
  }
  return null
}

function getCategoryDefaultImage(title: string = '', categoryName: string = ''): string {
  const lowerTitle = title.toLowerCase()
  const lowerCategory = categoryName.toLowerCase()

  if (lowerCategory.includes('blender') || lowerTitle.includes('blender')) {
    return '/defaults/blender.png'
  }
  if (lowerTitle.includes('figma') || lowerCategory.includes('figma')) {
    return '/defaults/figma.png'
  }
  if (lowerTitle.includes('photoshop') || lowerCategory.includes('photoshop')) {
    return '/defaults/photoshop.png'
  }
  if (lowerTitle.includes('illustrator') || lowerCategory.includes('illustrator')) {
    return '/defaults/illustrator.png'
  }
  if (lowerTitle.includes('indesign') || lowerCategory.includes('indesign')) {
    return '/defaults/indesign.png'
  }
  if (lowerTitle.includes('after effects') || lowerCategory.includes('after effects') || lowerTitle.includes('aftereffects')) {
    return '/defaults/aftereffects.png'
  }

  return '/defaults/default.png'
}

async function downloadImage(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) return null
    
    const buffer = await response.arrayBuffer()
    const fileExt = imageUrl.split('.').pop()?.split('?')[0] || 'jpg'
    const fileName = `resource-${nanoid()}-preview.${fileExt}`
    const path = `/assets/previews/${fileName}`
    const fullPath = join(process.cwd(), 'public', 'assets', 'previews', fileName)

    await writeFile(fullPath, Buffer.from(buffer))
    return path
  } catch (error) {
    console.error('Error downloading image:', error)
    return null
  }
}

function getFigmaFileId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (!urlObj.hostname.includes('figma.com')) return null
    
    // Handle thumbnail URLs
    if (url.includes('thumbnails/')) {
      const matches = url.match(/thumbnails\/([^/&?]+)/)
      return matches?.[1] || null
    }
    
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

function getSkillshareId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (!urlObj.hostname.includes('skillshare.com')) return null
    
    // Handle class URLs
    const matches = url.match(/classes\/([^/]+)\//)
    return matches?.[1] || null
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || ''
  const category = searchParams.get('category') || ''

  try {
    let imageUrl: string | null = null
    let description = ''
    let siteName = ''
    const urlString = searchParams.get('url')

    if (!urlString || !isValidUrl(urlString)) {
      return NextResponse.json({ 
        error: 'Invalid URL',
        title: 'Invalid URL',
        siteName: 'Error',
        image: getCategoryDefaultImage(title, category)
      }, { 
        status: 400 
      })
    }

    const url = new URL(urlString)
    console.log('Fetching preview for:', urlString)

    // Get category default image for fallback
    const categoryDefaultImage = getCategoryDefaultImage(title, category)
    console.log('Category default image available:', categoryDefaultImage)

    // Handle Skillshare URLs first
    const skillshareId = getSkillshareId(urlString)
    if (skillshareId) {
      console.log('Skillshare class detected, ID:', skillshareId)
      // Try to fetch the page to get metadata
      const response = await fetch(urlString, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        }
      })
      
      if (response.ok) {
        const text = await response.text()
        const imagePatterns = [
          /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i,
          /<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i,
          /<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i,
          /<meta[^>]*content="([^"]*)"[^>]*name="twitter:image"[^>]*>/i
        ]
        const foundImage = findMetaContent(text, imagePatterns)
        if (foundImage) {
          const storedPath = await downloadImage(foundImage)
          if (storedPath) {
            return NextResponse.json({
              title: title || 'Skillshare Class',
              image: storedPath,
              siteName: 'Skillshare',
              type: 'link'
            })
          }
        }
      }
      
      // If we couldn't get the image, use the default Skillshare image
      return NextResponse.json({
        title: title || 'Skillshare Class',
        image: '/defaults/skillshare.png',
        siteName: 'Skillshare',
        type: 'link'
      })
    }

    // Try to fetch the page content
    const response = await fetch(urlString, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      },
      next: { revalidate: 3600 }
    }).catch(error => {
      console.error('Error fetching URL:', error)
      return null
    })

    // If fetch fails, use category default
    if (!response?.ok) {
      console.log('Failed to fetch URL, using category default')
      return NextResponse.json({
        title: title || url.hostname,
        siteName: url.hostname,
        type: 'link',
        image: categoryDefaultImage
      })
    }

    // Handle Figma URLs first
    const figmaFileId = getFigmaFileId(urlString)
    if (figmaFileId) {
      console.log('Figma file detected, ID:', figmaFileId)
      const figmaImageUrl = `https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/${figmaFileId}`
      const storedPath = await downloadImage(figmaImageUrl)
      if (storedPath) {
        return NextResponse.json({
          title: title || 'Figma File',
          image: storedPath,
          siteName: 'Figma',
          type: 'link'
        })
      }
      // If Figma image fails, use category default
      return NextResponse.json({
        title: title || 'Figma File',
        image: categoryDefaultImage,
        siteName: 'Figma',
        type: 'link'
      })
    }

    // Handle YouTube URLs
    const youtubeId = getYouTubeId(urlString)
    if (youtubeId) {
      console.log('YouTube video detected, ID:', youtubeId)
      const youtubeImageUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
      // Try to download YouTube thumbnail
      const storedPath = await downloadImage(youtubeImageUrl)
      return NextResponse.json({
        title: title || 'YouTube Video',
        image: storedPath || categoryDefaultImage,
        siteName: 'YouTube',
        type: 'video'
      })
    }

    // Fetch page content
    const text = await response.text()
    
    // Try multiple meta tag patterns for images
    const imagePatterns = [
      /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i,
      /<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i,
      /<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i,
      /<meta[^>]*content="([^"]*)"[^>]*name="twitter:image"[^>]*>/i,
      /<link[^>]*rel="image_src"[^>]*href="([^"]*)"[^>]*>/i,
      /<link[^>]*href="([^"]*)"[^>]*rel="image_src"[^>]*>/i
    ]

    imageUrl = findMetaContent(text, imagePatterns)
    console.log('Found meta image:', imageUrl)

    // If no meta image found, try to find a large image in the HTML
    if (!imageUrl) {
      const imgPattern = /<img[^>]*src="([^"]*)"[^>]*>/gi
      let match
      while ((match = imgPattern.exec(text)) !== null) {
        const imgTag = match[0]
        const src = match[1]
        
        // Check if image has width/height attributes indicating a large image
        const widthMatch = imgTag.match(/width="(\d+)"/i)
        const heightMatch = imgTag.match(/height="(\d+)"/i)
        
        if (widthMatch && heightMatch) {
          const width = parseInt(widthMatch[1])
          const height = parseInt(heightMatch[1])
          if (width >= 200 && height >= 200) {
            imageUrl = src
            console.log('Found large image in HTML:', imageUrl)
            break
          }
        }
      }
    }

    // Convert relative URLs to absolute and download
    if (imageUrl) {
      const absoluteUrl = getAbsoluteUrl(imageUrl, url.origin)
      if (absoluteUrl) {
        imageUrl = absoluteUrl
        console.log('Converted to absolute URL:', imageUrl)
        // Download and store the image
        const storedPath = await downloadImage(imageUrl)
        if (storedPath) {
          imageUrl = storedPath
          console.log('Stored image locally:', storedPath)
        }
      }
    }

    // Only use category default if no other image was found or stored
    if (!imageUrl) {
      imageUrl = categoryDefaultImage
      console.log('No image found, using category default:', imageUrl)
    }

    // Get other metadata
    const titlePatterns = [
      /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i,
      /<meta[^>]*content="([^"]*)"[^>]*property="og:title"[^>]*>/i,
      /<title>(.*?)<\/title>/i
    ]

    const descriptionPatterns = [
      /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i,
      /<meta[^>]*content="([^"]*)"[^>]*property="og:description"[^>]*>/i,
      /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i
    ]

    const siteNamePatterns = [
      /<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"[^>]*>/i,
      /<meta[^>]*content="([^"]*)"[^>]*property="og:site_name"[^>]*>/i
    ]

    const metaTitle = findMetaContent(text, titlePatterns)
    description = findMetaContent(text, descriptionPatterns) || ''
    siteName = findMetaContent(text, siteNamePatterns) || url.hostname

    const result = {
      title: title || metaTitle || url.hostname,
      description,
      image: imageUrl,
      siteName,
      type: 'link'
    }

    console.log('Preview result:', result)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error processing URL:', error)
    return NextResponse.json({ 
      title: 'Invalid URL',
      siteName: 'Error',
      type: 'link',
      error: 'Failed to process URL',
      image: getCategoryDefaultImage(title, category)
    })
  }
} 