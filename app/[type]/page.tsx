import Home from '@/app/page'
import { Metadata } from 'next'

interface Props {
  params: { type: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
  
  if (contentType) {
    return {
      title: `${contentType}s - OLS Training Hub`,
      description: `Browse all ${contentType.toLowerCase()}s available in the OLS Training Hub.`,
    }
  }
  
  // Fallback if no valid type found
  return {
    title: 'Resources - OLS Training Hub',
    description: 'Browse resources and training materials in the OLS Training Hub.',
  }
}

export default Home 