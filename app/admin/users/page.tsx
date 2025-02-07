import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import UserStats from './UserStats'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isAdmin) {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: {
          submittedResources: true,
          favorites: true,
          completed: true
        }
      }
    }
  })

  return (
    <div className="container py-4">
      <h1 className="mb-4">User Management</h1>
      
      <div className="row">
        {users.map(user => (
          <div key={user.id} className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  {user.image && (
                    <img 
                      src={user.image} 
                      alt={user.name || user.email}
                      className="rounded-circle me-3"
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <h5 className="card-title mb-0">
                      {user.name || user.email}
                    </h5>
                    {user.name && (
                      <div className="text-muted small">
                        {user.email}
                      </div>
                    )}
                  </div>
                  <div className="ms-auto">
                    <span className={`badge ${user.isAdmin ? 'bg-primary' : 'bg-secondary'}`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Submitted</h6>
                        <h3 className="card-title mb-0">{user._count.submittedResources}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Favorited</h6>
                        <h3 className="card-title mb-0">{user._count.favorites}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Completed</h6>
                        <h3 className="card-title mb-0">{user._count.completed}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <UserStats userId={user.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 