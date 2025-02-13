import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
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
    
    // Decode HTML entities in the URL
    const decodedUrl = relativeUrl.replace(/&amp;/g, '&')
      .replace(/&#47;/g, '/')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    
    // Handle protocol-relative URLs
    if (decodedUrl.startsWith('//')) {
      return `https:${decodedUrl}`
    }
    
    // Handle root-relative URLs
    if (decodedUrl.startsWith('/')) {
      const url = new URL(baseUrl)
      return `${url.origin}${decodedUrl}`
    }
    
    // Handle already absolute URLs
    if (decodedUrl.startsWith('http')) {
      return decodedUrl
    }
    
    // Handle relative URLs
    return new URL(decodedUrl, baseUrl).toString()
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
  // Common CDN domains that should be ignored
  const ignoreDomains = [
    'cdn.', 'assets.', 'static.', 'media.', 'img.',
    'images.', 'content.', 'storage.', 's3.amazonaws'
  ]

  // Clean the hostname by removing common CDN prefixes
  const cleanHostname = ignoreDomains.reduce(
    (host, cdn) => host.replace(cdn, ''),
    hostname.toLowerCase()
  )

  // Map of domain patterns to default images
  const defaultImages: [RegExp, string][] = [
    [/youtube\.com|youtu\.be/, 'https://www.youtube.com/img/desktop/yt_1200.png'],
    [/github\.com/, 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'],
    [/linkedin\.com/, 'https://static.licdn.com/aero-v1/sc/h/3usjoqvsfrr7z3ovwvk8r6mz0'],
    [/twitter\.com|x\.com/, 'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png'],
    [/medium\.com/, 'https://miro.medium.com/v2/1*m-R_BkNf1Qjr1YbyOIJY2w.png'],
    [/codepen\.io/, 'https://assets.codepen.io/t-1/codepen-logo.svg'],
    // For these, we'll use data URLs to ensure they always work
    [/figma\.com/, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzgiIGhlaWdodD0iNTciIHZpZXdCb3g9IjAgMCAzOCA1NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgMjguNWExOS4xIDE5LjEgMCAwIDEgMTktMTl2MGExOS4xIDE5LjEgMCAwIDEtMTkgMTl2MHoiIGZpbGw9IiMxQUJDRkUiLz48cGF0aCBkPSJNMCAyOC41YTE5LjEgMTkuMSAwIDAgMSAxOS0xOXYzOGExOS4xIDE5LjEgMCAwIDEtMTktMTl6IiBmaWxsPSIjMEFDRjgzIi8+PHBhdGggZD0iTTAgNDcuNWExOS4xIDE5LjEgMCAwIDEgMTktMTl2MzhhMTkuMSAxOS4xIDAgMCAxLTE5LTE5eiIgZmlsbD0iI0EyNTlGRiIvPjxwYXRoIGQ9Ik0wIDkuNUExOS4xIDE5LjEgMCAwIDEgMTktOS41djM4QTE5LjEgMTkuMSAwIDAgMSAwIDkuNXoiIGZpbGw9IiNGMjRFMUUiLz48cGF0aCBkPSJNMTkgMjguNWExOS4xIDE5LjEgMCAwIDEgMTktMTl2MzhhMTkuMSAxOS4xIDAgMCAxLTE5LTE5eiIgZmlsbD0iI0ZGNzI2MiIvPjwvc3ZnPg=='],
    [/skillshare\.com/, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgNDhDMzcuMjU0OCA0OCA0OCAzNy4yNTQ4IDQ4IDI0QzQ4IDEwLjc0NTIgMzcuMjU0OCAwIDI0IDBDMTAuNzQ1MiAwIDAgMTAuNzQ1MiAwIDI0QzAgMzcuMjU0OCAxMC43NDUyIDQ4IDI0IDQ4WiIgZmlsbD0iIzAwMiIvPjxwYXRoIGQ9Ik0zNi45IDIyLjVDMzYuOSAxNi44IDMyLjIgMTIuMSAyNi41IDEyLjFDMjAuOCAxMi4xIDE2LjEgMTYuOCAxNi4xIDIyLjVDMTYuMSAyOC4yIDIwLjggMzIuOSAyNi41IDMyLjlDMzIuMiAzMi45IDM2LjkgMjguMiAzNi45IDIyLjVaIiBmaWxsPSIjRkZGIi8+PC9zdmc+']
  ]

  // Find matching domain and return its default image
  for (const [pattern, image] of defaultImages) {
    if (pattern.test(cleanHostname)) {
      return image
    }
  }

  // Return null if no match found
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

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function downloadImage(imageUrl: string): Promise<string | null> {
  try {
    if (!imageUrl) return null;

    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    // If it's a local path starting with /assets or /defaults, return as is
    if (imageUrl.startsWith('/assets/') || imageUrl.startsWith('/defaults/')) {
      return imageUrl;
    }

    console.log('Downloading image from:', imageUrl);

    // If it's an SVG, just return the URL directly
    if (imageUrl.toLowerCase().endsWith('.svg') || imageUrl.includes('svg+xml')) {
      console.log('SVG detected, using direct URL:', imageUrl);
      return imageUrl;
    }

    const response = await fetchWithTimeout(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.log('Failed to fetch image:', response.status, response.statusText);
      return null;
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType?.startsWith('image/')) {
      console.log('Invalid content type:', contentType);
      return null;
    }
    
    // Don't try to save SVGs locally
    if (contentType.includes('svg+xml')) {
      console.log('SVG detected from content-type, using direct URL:', imageUrl);
      return imageUrl;
    }
    
    const buffer = await response.arrayBuffer()
    const fileExt = contentType.split('/')[1]?.split(';')[0] || 'jpg'
    const fileName = `resource-${nanoid()}-preview.${fileExt}`
    const previewsDir = join(process.cwd(), 'public', 'assets', 'previews')
    const path = `/assets/previews/${fileName}`
    const fullPath = join(previewsDir, fileName)

    try {
      // Ensure the previews directory exists
      await mkdir(previewsDir, { recursive: true })
      await writeFile(fullPath, Buffer.from(buffer))
      console.log('Successfully saved image to:', path);
      return path
    } catch (writeError) {
      console.error('Error writing image file:', writeError)
      // If we can't save locally, return the original URL
      return imageUrl
    }
  } catch (error) {
    console.error('Error downloading image:', error)
    // Return the original URL if download fails
    return imageUrl
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
  const urlString = searchParams.get('url')

  console.log('Preview request for URL:', urlString);

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

  try {
    const url = new URL(urlString)
    console.log('Fetching preview for:', urlString)

    const categoryDefaultImage = getCategoryDefaultImage(title, category)
    const defaultSiteImage = getDefaultImage(url.hostname)

    // Try to fetch the page content with timeout
    const response = await fetchWithTimeout(urlString, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.log('Failed to fetch page:', response.status, response.statusText);
      return NextResponse.json({
        image: defaultSiteImage || categoryDefaultImage,
        title: title,
        siteName: url.hostname,
      })
    }

    const text = await response.text()
    
    // Extract metadata using various methods
    const metaPatterns = {
      ogImage: [
        /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i
      ],
      twitterImage: [
        /<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*content="([^"]*)"[^>]*name="twitter:image"[^>]*>/i
      ],
      favicon: [
        /<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/i,
        /<link[^>]*href="([^"]*)"[^>]*rel="icon"[^>]*>/i,
        /<link[^>]*rel="shortcut icon"[^>]*href="([^"]*)"[^>]*>/i
      ],
      title: [
        /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*content="([^"]*)"[^>]*property="og:title"[^>]*>/i,
        /<title[^>]*>([^<]*)<\/title>/i
      ],
      description: [
        /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*content="([^"]*)"[^>]*property="og:description"[^>]*>/i,
        /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i
      ],
      siteName: [
        /<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*content="([^"]*)"[^>]*property="og:site_name"[^>]*>/i
      ]
    }

    // Extract all images from the page
    const allImages = text.match(/<img[^>]*src="([^"]*)"[^>]*>/ig)?.map(img => {
      const src = img.match(/src="([^"]*)"/i)?.[1]
      return src ? getAbsoluteUrl(src, urlString) : null
    }).filter(Boolean) || []

    // Get metadata
    const metadata = {
      ogImage: findMetaContent(text, metaPatterns.ogImage),
      twitterImage: findMetaContent(text, metaPatterns.twitterImage),
      favicon: findMetaContent(text, metaPatterns.favicon),
      title: findMetaContent(text, metaPatterns.title),
      description: findMetaContent(text, metaPatterns.description),
      siteName: findMetaContent(text, metaPatterns.siteName),
      images: allImages
    }

    // Clean up and make image URLs absolute
    if (metadata.ogImage) {
      metadata.ogImage = getAbsoluteUrl(metadata.ogImage, urlString)
    }
    if (metadata.twitterImage) {
      metadata.twitterImage = getAbsoluteUrl(metadata.twitterImage, urlString)
    }
    if (metadata.favicon) {
      metadata.favicon = getAbsoluteUrl(metadata.favicon, urlString)
    }

    console.log('Found metadata:', metadata);

    // Try to download the best image
    const imagesToTry = [
      metadata.ogImage,
      metadata.twitterImage,
      ...allImages,
      metadata.favicon,
      defaultSiteImage,
      categoryDefaultImage
    ].filter(Boolean)

    console.log('Attempting to download images:', imagesToTry);

    let storedImagePath = null
    for (const img of imagesToTry) {
      if (!img) continue
      storedImagePath = await downloadImage(img)
      if (storedImagePath) {
        console.log('Successfully got image:', storedImagePath);
        break
      }
    }

    const result = {
      ...metadata,
      image: storedImagePath || categoryDefaultImage,
      type: 'link'
    };

    console.log('Returning preview result:', result);

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching preview:', error)
    return NextResponse.json({
      error: 'Failed to fetch preview',
      image: getCategoryDefaultImage(title, category),
      title: title || 'Unknown Title',
      siteName: new URL(urlString).hostname
    })
  }
} 