import { promises as fs } from 'fs'
import path from 'path'

const FALLBACK_IMAGES = {
  'skillshare.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#002333" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#FFFFFF" font-family="system-ui" font-weight="bold" font-size="80">Ss</text>
    </svg>
  `,
  'cgfasttrack.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#FF6B2B" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#FFFFFF" font-family="system-ui" font-weight="bold" font-size="80">CG</text>
    </svg>
  `,
  'figma.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#1E1E1E" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#FFFFFF" font-family="system-ui" font-weight="bold" font-size="80">F</text>
    </svg>
  `,
  'mds.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#000000" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#FFFFFF" font-family="system-ui" font-weight="bold" font-size="80">M</text>
    </svg>
  `,
  'adobe.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#FA0F00" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#FFFFFF" font-family="system-ui" font-weight="bold" font-size="80">A</text>
    </svg>
  `,
  'blender.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#E87D0D" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#FFFFFF" font-family="system-ui" font-weight="bold" font-size="80">B</text>
    </svg>
  `,
  'photoshop.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#001E36" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#31A8FF" font-family="system-ui" font-weight="bold" font-size="80">Ps</text>
    </svg>
  `,
  'aftereffects.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#00005B" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#9999FF" font-family="system-ui" font-weight="bold" font-size="80">Ae</text>
    </svg>
  `,
  'illustrator.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#330000" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#FF9A00" font-family="system-ui" font-weight="bold" font-size="80">Ai</text>
    </svg>
  `,
  'indesign.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#49021F" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#FF3366" font-family="system-ui" font-weight="bold" font-size="80">Id</text>
    </svg>
  `,
  'default.png': `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#E9ECEF" rx="8"/>
      <text x="100" y="120" text-anchor="middle" fill="#6C757D" font-family="system-ui" font-weight="bold" font-size="80">?</text>
    </svg>
  `
}

async function main() {
  const fallbacksDir = path.join(process.cwd(), 'public', 'images', 'fallbacks')
  
  try {
    await fs.mkdir(fallbacksDir, { recursive: true })
    
    for (const [filename, content] of Object.entries(FALLBACK_IMAGES)) {
      const filepath = path.join(fallbacksDir, filename)
      await fs.writeFile(filepath, content.trim())
      console.log(`Created ${filename}`)
    }
    
    console.log('All fallback images created successfully!')
  } catch (error) {
    console.error('Error creating images:', error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 