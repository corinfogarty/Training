import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function check() {
  const resources = await prisma.resource.findMany({
    where: {
      previewImage: {
        contains: 'http'
      }
    },
    select: {
      id: true,
      title: true,
      previewImage: true,
      category: {
        select: {
          name: true
        }
      }
    }
  })

  console.log('Resources with external URLs:')
  console.log(JSON.stringify(resources, null, 2))

  await prisma.$disconnect()
}

check()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 