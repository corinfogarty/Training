import Home from '@/app/page'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

interface Props {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Try to find a matching category by slug
  const categorySlug = decodeURIComponent(params.category)
  
  try {
    const categories = await prisma.category.findMany()
    const matchingCategory = categories.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
    )
    
    if (matchingCategory) {
      return {
        title: `${matchingCategory.name} Resources - OLS Training Hub`,
        description: matchingCategory.description || `Browse ${matchingCategory.name} resources and training materials.`,
      }
    }
  } catch (error) {
    console.error('Error fetching category for metadata:', error)
  }
  
  // Fallback if no category found
  return {
    title: 'Resources - OLS Training Hub',
    description: 'Browse resources and training materials in the OLS Training Hub.',
  }
}

export default Home 