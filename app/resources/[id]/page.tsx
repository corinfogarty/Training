import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import ResourceCard from '@/components/ResourceCard'

export default async function ResourcePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent(`/resources/${params.id}`))
  }

  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
    include: {
      category: true,
    },
  })

  if (!resource) {
    redirect('/')
  }

  return (
    <main className="p-8">
      <ResourceCard resource={resource} />
    </main>
  )
} 