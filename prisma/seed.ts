import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const gettingStarted = await prisma.category.create({
    data: {
      name: 'Getting Started',
      description: 'Essential resources for getting started',
      order: 0,
      resources: {
        create: [
          {
            title: 'Welcome Guide',
            description: JSON.stringify({
              title: 'Welcome Guide',
              description: 'Welcome to our platform! This guide will help you get started.',
              credentials: {},
              courseContent: []
            }),
            url: 'https://example.com/welcome',
            contentType: 'Training',
            previewImage: null,
            additionalUrls: []
          },
          {
            title: 'Quick Start Video',
            description: JSON.stringify({
              title: 'Quick Start Video',
              description: 'A quick video tutorial to help you get started.',
              credentials: {},
              courseContent: []
            }),
            url: 'https://example.com/quickstart',
            contentType: 'Training',
            previewImage: null,
            additionalUrls: []
          }
        ]
      }
    }
  })

  const tutorials = await prisma.category.create({
    data: {
      name: 'Tutorials',
      description: 'Step-by-step tutorials and guides',
      order: 1,
      resources: {
        create: [
          {
            title: 'Basic Tutorial',
            description: JSON.stringify({
              title: 'Basic Tutorial',
              description: 'Learn the basics with this comprehensive tutorial.',
              credentials: {},
              courseContent: []
            }),
            url: 'https://example.com/basic-tutorial',
            contentType: 'Training',
            previewImage: null,
            additionalUrls: []
          }
        ]
      }
    }
  })

  console.log('Database has been seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 