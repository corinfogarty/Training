import { promises as fs } from 'fs'
import path from 'path'

const CATEGORY_IMAGES = {
  'default.svg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#E9ECEF" rx="4"/>
      <text x="20" y="24" text-anchor="middle" fill="#6C757D" font-family="system-ui" font-size="16">?</text>
    </svg>
  `,
  'onboarding.svg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#E3F2FD" rx="4"/>
      <text x="20" y="24" text-anchor="middle" fill="#1976D2" font-family="system-ui" font-size="16">O</text>
    </svg>
  `,
  'after-effects.svg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#00005B" rx="4"/>
      <text x="20" y="24" text-anchor="middle" fill="#9999FF" font-family="system-ui" font-size="16">Ae</text>
    </svg>
  `,
  'blender.svg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#E87D0D" rx="4"/>
      <text x="20" y="24" text-anchor="middle" fill="#FFFFFF" font-family="system-ui" font-size="16">B</text>
    </svg>
  `,
  'figma.svg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#1E1E1E" rx="4"/>
      <text x="20" y="24" text-anchor="middle" fill="#FFFFFF" font-family="system-ui" font-size="16">F</text>
    </svg>
  `,
  'illustrator.svg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#330000" rx="4"/>
      <text x="20" y="24" text-anchor="middle" fill="#FF9A00" font-family="system-ui" font-size="16">Ai</text>
    </svg>
  `,
  'indesign.svg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#49021F" rx="4"/>
      <text x="20" y="24" text-anchor="middle" fill="#FF3366" font-family="system-ui" font-size="16">Id</text>
    </svg>
  `,
  'photoshop.svg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#001E36" rx="4"/>
      <text x="20" y="24" text-anchor="middle" fill="#31A8FF" font-family="system-ui" font-size="16">Ps</text>
    </svg>
  `
}

async function main() {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'categories')
  
  try {
    await fs.mkdir(imagesDir, { recursive: true })
    
    for (const [filename, content] of Object.entries(CATEGORY_IMAGES)) {
      const filepath = path.join(imagesDir, filename)
      await fs.writeFile(filepath, content.trim())
      console.log(`Created ${filename}`)
    }
    
    console.log('All category images created successfully!')
  } catch (error) {
    console.error('Error creating images:', error)
  }
}

main() 