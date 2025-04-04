import Home from '@/app/page'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

interface Props {
  params: { 
    category: string
    type: string 
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Try to find a matching category by slug
  const categorySlug = decodeURIComponent(params.category)
  const typeSlug = decodeURIComponent(params.type)
  
  let contentType = ''
  
  // Convert type slug to proper content type
  switch (typeSlug.toLowerCase()) {
    case 'resource':
      contentType = 'Resource'
      break
    case 'training':
      contentType = 'Training'  
      break
    case 'shortcut':
      contentType = 'Shortcut'
      break
    case 'plugin':
      contentType = 'Plugin'
      break
    default:
      contentType = ''
  }
  
  try {
    const categories = await prisma.category.findMany()
    const matchingCategory = categories.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
    )
    
    if (matchingCategory && contentType) {
      return {
        title: `${matchingCategory.name} ${contentType}s - OLS Training Hub`,
        description: `Browse ${contentType.toLowerCase()}s in the ${matchingCategory.name} category.`,
      }
    } else if (matchingCategory) {
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