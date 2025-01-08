import { prisma } from '../lib/prisma'

async function main() {
  const email = 'corin@ols.design'
  
  const user = await prisma.user.update({
    where: { email },
    data: { isAdmin: true }
  })
  
  console.log(`Updated user ${user.name} (${user.email}) to admin status`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 