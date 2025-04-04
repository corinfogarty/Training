'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Home from '@/app/page'

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const router = useRouter()
  
  // Check if this is a direct page load
  useEffect(() => {
    // The category will be parsed in the CategoryList component
    console.log(`Category from URL: ${params.category}`)
  }, [params.category])

  // We just use the Home component which has the CategoryList component
  // CategoryList will extract the category from the URL
  return <Home />
} 