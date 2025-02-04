import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function check() {
  const resourceId = 'cm6qp60xj0022mliz03tp0pvh'
  
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: {
      category: true
    }
  })

  console.log('Resource details:')
  console.log(JSON.stringify(resource, null, 2))

  if (resource?.previewImage) {
    const localPath = path.join(process.cwd(), 'public', resource.previewImage)
    try {
      await fs.access(localPath)
      const stats = await fs.stat(localPath)
      console.log('\nFile exists:', localPath)
      console.log('File size:', stats.size, 'bytes')
    } catch (error) {
      console.log('\nFile does not exist:', localPath)
    }
  }

  await prisma.$disconnect()
}

check()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 