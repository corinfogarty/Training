import { NextResponse } from 'next/server'

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
    'figma.com': 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1108x1108.png',
    'twitter.com': 'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png',
    'medium.com': 'https://miro.medium.com/v2/1*m-R_BkNf1Qjr1YbyOIJY2w.png',
    'codepen.io': 'https://assets.codepen.io/t-1/codepen-logo.svg'
  }

  for (const [domain, image] of Object.entries(defaultImages)) {
    if (hostname.includes(domain)) {
      return image
    }
  }
  return null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const urlString = searchParams.get('url')

  if (!urlString || !isValidUrl(urlString)) {
    return NextResponse.json({ 
      error: 'Invalid URL',
      title: 'Invalid URL',
      siteName: 'Error'
    }, { 
      status: 400 
    })
  }

  try {
    const url = new URL(urlString)
    console.log('Fetching preview for:', urlString)

    // Handle YouTube URLs
    const youtubeId = getYouTubeId(urlString)
    if (youtubeId) {
      console.log('YouTube video detected, ID:', youtubeId)
      return NextResponse.json({
        title: 'YouTube Video',
        image: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        siteName: 'YouTube',
        type: 'video'
      })
    }

    // Try default image first
    const defaultImage = getDefaultImage(url.hostname)
    if (defaultImage) {
      console.log('Using default image for:', url.hostname)
    }

    // Fetch page content
    const response = await fetch(urlString, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      },
      next: { revalidate: 3600 }
    }).catch(error => {
      console.error('Error fetching URL:', error)
      return null
    })

    if (!response?.ok) {
      console.log('Failed to fetch URL, using default image')
      return NextResponse.json({
        title: url.hostname,
        siteName: url.hostname,
        type: 'link',
        image: defaultImage,
        error: 'Failed to fetch URL'
      })
    }

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

    let imageUrl = findMetaContent(text, imagePatterns)
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

    // Convert relative URLs to absolute
    if (imageUrl) {
      const absoluteUrl = getAbsoluteUrl(imageUrl, url.origin)
      if (absoluteUrl) {
        imageUrl = absoluteUrl
        console.log('Converted to absolute URL:', imageUrl)
      }
    }

    // Fallback to default image if no image found
    if (!imageUrl && defaultImage) {
      imageUrl = defaultImage
      console.log('Using default image fallback')
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

    const title = findMetaContent(text, titlePatterns) || url.hostname
    const description = findMetaContent(text, descriptionPatterns) || ''
    const siteName = findMetaContent(text, siteNamePatterns) || url.hostname

    const result = {
      title,
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
      error: 'Failed to process URL'
    })
  }
} 