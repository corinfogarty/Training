import { Metadata } from 'next'
import ResourceView from './ResourceView'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Resource ${params.id}`,
  }
}

export default function ResourcePage({ params }: Props) {
  return <ResourceView resourceId={params.id} />
} 