import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminNav from '@/components/admin/AdminNav'
import { Container } from 'react-bootstrap'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isAdmin) {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        <Container className="py-4">
          {children}
        </Container>
      </main>
    </div>
  )
} 