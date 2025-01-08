import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets')

async function ensureAssetsDir() {
  try {
    await fs.access(ASSETS_DIR)
  } catch {
    await fs.mkdir(ASSETS_DIR, { recursive: true })
  }
}

async function downloadImage(url: string, filename: string): Promise<string> {
  try {
    // First request to get the redirect URL
    const initialResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://app.asana.com/',
        'Cookie': process.env.ASANA_COOKIE || ''
      },
      redirect: 'manual'
    })

    // Get the S3 URL from the redirect
    const s3Url = initialResponse.headers.get('location')
    if (!s3Url) {
      throw new Error('No redirect URL found')
    }

    console.log('Following redirect to:', s3Url)

    // Now fetch the actual image from S3
    const imageResponse = await fetch(s3Url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      }
    })

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText} (${imageResponse.status})`)
    }

    // Verify content type
    const contentType = imageResponse.headers.get('content-type')
    if (!contentType?.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}`)
    }

    // Get the correct file extension
    const ext = contentType.split('/')[1].split(';')[0]
    const finalFilename = `${filename}.${ext}`

    // Get the binary data
    const buffer = await imageResponse.buffer()

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

    return `/assets/${finalFilename}`
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error)
    return '' // Return empty string if download fails
  }
}

async function findAsanaUrls(text: string): Promise<string[]> {
  const asanaUrlRegex = /https:\/\/app\.asana\.com\/app\/asana\/-\/get_asset\?[^\s"')]+/g
  return text.match(asanaUrlRegex) || []
}

async function downloadAssets() {
  try {
    await ensureAssetsDir()

    const resources = await prisma.resource.findMany({
      where: {
        description: {
          contains: 'get_asset?asset_id='
        }
      }
    })

    console.log(`Found ${resources.length} resources with Asana assets`)

    for (const resource of resources) {
      const asanaUrls = await findAsanaUrls(resource.description)
      
      if (asanaUrls.length === 0) continue

      console.log(`\nProcessing ${resource.title} (${asanaUrls.length} assets)`)

      let description = resource.description

      for (const [index, asanaUrl] of asanaUrls.entries()) {
        console.log(`\nDownloading asset ${index + 1} of ${asanaUrls.length}`)
        console.log(`URL: ${asanaUrl}`)

        const assetId = asanaUrl.match(/asset_id=(\d+)/)?.[1]
        if (!assetId) continue

        const filename = `resource-${resource.id}-asset-${assetId}.png`
        const localPath = await downloadImage(asanaUrl, filename)

        if (localPath) {
          // Replace the Asana URL with the local path in the description
          description = description.replace(asanaUrl, localPath)

          // Set as preview image if none exists
          if (!resource.previewImage) {
            await prisma.resource.update({
              where: { id: resource.id },
              data: { previewImage: localPath }
            })
            console.log('✓ Set as preview image')
          }
        }
      }

      // Update the resource with the modified description
      await prisma.resource.update({
        where: { id: resource.id },
        data: { description }
      })
      console.log('✓ Updated resource description')
    }

    console.log('\nAsset download complete!')
  } catch (error) {
    console.error('Error during asset download:', error)
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