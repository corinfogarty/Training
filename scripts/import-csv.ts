import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { parse } from 'csv-parse'
import path from 'path'

const prisma = new PrismaClient()

interface CSVRecord {
  'Task ID': string
  'Created At': string
  'Completed At': string
  'Last Modified': string
  'Name': string
  'Section/Column': string
  'Assignee': string
  'Start Date': string
  'Due Date': string
  'Tags': string
  'Notes': string
  'Projects': string
  'Parent task': string
  'Blocked By': string
  'Blocking': string
  'NEW': string
  'Difficulty': string
  'TICKET STATUS': string
}

type ResourceType = 'VIDEO' | 'DOCUMENT' | 'IMAGE' | 'LINK'

function determineResourceType(record: CSVRecord): ResourceType {
  const type = record.Tags.toLowerCase()
  if (type.includes('video')) return 'VIDEO'
  if (type.includes('document')) return 'DOCUMENT'
  if (type.includes('image')) return 'IMAGE'
  return 'LINK'
}

function getPreviewImage(url: string, type: ResourceType): string | null {
  if (!url || url === '#pending' || url === 'NEW') return null

  if (type === 'VIDEO') {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:v=|youtu\.be\/)([\w-]{11})(?:\?|$|&)/)?.[1]
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }
    }
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
      if (videoId) {
        return `https://vimeo.com/api/v2/video/${videoId}/thumbnail_large.jpg`
      }
    }
  }

  if (type === 'IMAGE' && url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return url
  }

  // For documents, could add logic for PDF thumbnails, Google Doc previews, etc.
  return null
}

function cleanUrl(url: string): string {
  if (!url || url === 'NEW' || url === '#' || url.includes('app.asana.com')) {
    return '#pending'
  }
  return url.trim()
}

async function importCSV() {
  const csvFilePath = path.join(__dirname, '../data/tasks.csv')
  
  const parser = fs
    .createReadStream(csvFilePath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true,
      trim: true
    }))

  for await (const record of parser) {
    try {
      const categoryName = record['Section/Column'].trim()
      
      // First find or create the category
      let category = await prisma.category.findUnique({
        where: { name: categoryName }
      })

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            description: null
          }
        })
      }

      // Extract URLs from notes
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const additionalUrls = (record.Notes?.match(urlRegex) || [])
        .filter((url: string) => url !== record.NEW)
        .filter((url: string, index: number, self: string[]) => self.indexOf(url) === index)
        .filter((url: string) => !url.includes('app.asana.com'))
        .map((url: string) => cleanUrl(url))
        .filter((url: string) => url !== '#pending')

      const type = determineResourceType(record)
      const mainUrl = cleanUrl(record.NEW)

      // Try to find a preview image from any valid URL
      const previewImage = 
        getPreviewImage(mainUrl, type) || 
        additionalUrls
          .map((url: string) => getPreviewImage(url, type))
          .find((img: string | null): img is string => img !== null) ||
        null

      // Then create the resource
      await prisma.resource.create({
        data: {
          title: record.Name,
          description: record.Notes || 'No description provided',
          url: mainUrl,
          additionalUrls,
          type,
          previewImage,
          categoryId: category.id,
          createdAt: new Date(record['Created At']),
          updatedAt: new Date(record['Last Modified'])
        }
      })
      console.log(`Imported: ${record.Name} (${mainUrl})`)
    } catch (error) {
      console.error(`Error importing ${record.Name}:`, error)
    }
  }
}

importCSV()
  .then(() => console.log('Import complete'))
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 