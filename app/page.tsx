import CategoryList from '@/components/CategoryList'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Home() {
  return (
    <ProtectedRoute>
      <CategoryList />
    </ProtectedRoute>
  )
} 