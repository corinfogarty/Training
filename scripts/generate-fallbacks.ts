import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const FALLBACK_DIR = path.join(process.cwd(), 'public', 'images', 'fallbacks')

const FALLBACK_IMAGES = {
  'default': {
    text: '?',
    bgColor: '#6B7280',
    textColor: '#ffffff'
  },
  'skillshare': {
    text: 'S',
    bgColor: '#FF7A00',
    textColor: '#ffffff'
  },
  'cgfasttrack': {
    text: 'CGF',
    bgColor: '#2563EB',
    textColor: '#ffffff'
  },
  'figma': {
    text: 'F',
    bgColor: '#1ABCFE',
    textColor: '#ffffff'
  },
  'mds': {
    text: 'MDS',
    bgColor: '#FF3366',
    textColor: '#ffffff'
  },
  'adobe': {
    text: 'A',
    bgColor: '#FF0000',
    textColor: '#ffffff'
  },
  'blender': {
    text: 'B',
    bgColor: '#E87D0D',
    textColor: '#ffffff'
  },
  'photoshop': {
    text: 'Ps',
    bgColor: '#31A8FF',
    textColor: '#ffffff'
  },
  'aftereffects': {
    text: 'Ae',
    bgColor: '#9999FF',
    textColor: '#ffffff'
  },
  'illustrator': {
    text: 'Ai',
    bgColor: '#FF9A00',
    textColor: '#ffffff'
  },
  'indesign': {
    text: 'Id',
    bgColor: '#FF3366',
    textColor: '#ffffff'
  }
}

async function generateFallbackImage(name: string, config: { text: string, bgColor: string, textColor: string }) {
  const size = 400
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${config.bgColor}"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="${size / 2}px"
        font-weight="bold"
        fill="${config.textColor}"
        text-anchor="middle"
        dominant-baseline="central"
      >${config.text}</text>
    </svg>
  `

  const outputPath = path.join(FALLBACK_DIR, `${name}.png`)
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath)
  
  console.log(`Generated ${name}.png`)
}

async function main() {
  try {
    // Ensure fallback directory exists
    await fs.mkdir(FALLBACK_DIR, { recursive: true })

    // Generate all fallback images
    for (const [name, config] of Object.entries(FALLBACK_IMAGES)) {
      await generateFallbackImage(name, config)
    }

    console.log('All fallback images generated successfully!')
  } catch (error) {
    console.error('Error generating fallback images:', error)
    process.exit(1)
  }
}

main() 