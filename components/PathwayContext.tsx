'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Resource, Category } from '@prisma/client'

type ResourceWithRelations = Resource & {
  category?: Category | null
  submittedBy?: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  } | null
}

type PathwayResource = {
  id: string
  resourceId: string
  order: number
  notes?: string
  resource: ResourceWithRelations
}

type Pathway = {
  id: string
  title: string
  description: string
  createdBy: {
    name: string
    image: string
  }
  resources: PathwayResource[]
}

interface PathwayContextType {
  selectedPathway: Pathway | null
  setSelectedPathway: (pathway: Pathway | null) => void
  showPathwayModal: boolean
  setShowPathwayModal: (show: boolean) => void
}

const PathwayContext = createContext<PathwayContextType | undefined>(undefined)

export function PathwayProvider({ children }: { children: ReactNode }) {
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null)
  const [showPathwayModal, setShowPathwayModal] = useState(false)

  return (
    <PathwayContext.Provider 
      value={{ 
        selectedPathway, 
        setSelectedPathway,
        showPathwayModal,
        setShowPathwayModal
      }}
    >
      {children}
    </PathwayContext.Provider>
  )
}

export function usePathway() {
  const context = useContext(PathwayContext)
  if (context === undefined) {
    throw new Error('usePathway must be used within a PathwayProvider')
  }
  return context
} 