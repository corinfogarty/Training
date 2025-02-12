import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface PathwayProgress {
  id: string
  totalResources: number
  completedResources: number
  progress: number
}

export function usePathwayProgress() {
  const { data: session } = useSession()
  const [progressData, setProgressData] = useState<Record<string, PathwayProgress>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      if (!session?.user?.id) return
      
      try {
        const response = await fetch(`/api/user/pathway-progress?userId=${session.user.id}`)
        if (!response.ok) throw new Error('Failed to fetch pathway progress')
        const data = await response.json()
        
        // Convert array to object with pathway ID as key
        const progressMap = data.reduce((acc: Record<string, PathwayProgress>, item: PathwayProgress) => {
          acc[item.id] = item
          return acc
        }, {})
        
        setProgressData(progressMap)
      } catch (error) {
        console.error('Error fetching pathway progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [session?.user?.id])

  return { progressData, loading }
} 