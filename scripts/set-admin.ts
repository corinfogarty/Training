import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setAdmin(email: string) {
  try {
    // First try to find the user
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // If user doesn't exist, create them
      user = await prisma.user.create({
        data: {
          email,
          isAdmin: true,
          name: email.split('@')[0] // Use email prefix as name
        }
      })
      console.log(`✅ Created new admin user: ${email}`)
    } else {
      // If user exists, update them
      user = await prisma.user.update({
        where: { email },
        data: {
          isAdmin: true
        }
      })
      console.log(`✅ Updated existing user to admin: ${email}`)
    }

    return user
  } catch (error) {
    console.error(`❌ Failed to make ${email} an admin:`, error)
    throw error
  }
}

async function main() {
  const adminEmails = [
    'corin@ols.design',
    // Add other admin emails here
  ]

  for (const email of adminEmails) {
    await setAdmin(email)
  }

  await prisma.$disconnect()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 