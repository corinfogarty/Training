import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Please provide an email address')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    })
    console.log(`Made ${user.email} an admin`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  }) 