import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create initial categories
  const gettingStarted = await prisma.category.create({
    data: {
      name: 'Getting Started',
      description: 'Essential resources for new team members',
      resources: {
        create: [
          {
            title: 'Welcome Guide',
            description: 'Introduction to the company and team',
            url: 'https://example.com/welcome',
            type: 'DOCUMENT'
          },
          {
            title: 'Setup Tutorial',
            description: 'How to set up your development environment',
            url: 'https://youtube.com/setup',
            type: 'VIDEO'
          }
        ]
      }
    }
  })

  const development = await prisma.category.create({
    data: {
      name: 'Development',
      description: 'Development resources and documentation',
      resources: {
        create: [
          {
            title: 'Coding Standards',
            description: 'Our team coding guidelines',
            url: 'https://example.com/standards',
            type: 'DOCUMENT'
          }
        ]
      }
    }
  })

  console.log({ gettingStarted, development })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 