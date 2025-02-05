import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `resource-${nanoid()}-preview.${fileExt}`
    const path = `/assets/previews/${fileName}`
    const fullPath = join(process.cwd(), 'public', 'assets', 'previews', fileName)

    // Save the file
    await writeFile(fullPath, buffer)

    return NextResponse.json({ path })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
} 