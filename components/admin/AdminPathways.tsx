'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical, Trash2, Search, Plus } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

type Resource = {
  id: string
  title: string
  description: string
  url: string
  contentType: 'Resource' | 'Training' | 'Shortcut' | 'Plugin'
  categoryId: string
  notes?: string
}

type Pathway = {
  id: string
  title: string
  description: string
  isPublished: boolean
  resources: {
    id: string
    resourceId: string
    order: number
    notes?: string
    resource: Resource
  }[]
}

export default function AdminPathways({ pathways, resources }: { pathways: Pathway[], resources: Resource[] }) {
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [selectedResources, setSelectedResources] = useState<Resource[]>([])
  const [resourceNotes, setResourceNotes] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [contentTypeFilter, setContentTypeFilter] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  const resetForm = () => {
    setSelectedPathway(null)
    setTitle('')
    setDescription('')
    setIsPublished(false)
    setSelectedResources([])
    setResourceNotes({})
  }

  const handleSelectPathway = (pathway: Pathway) => {
    setSelectedPathway(pathway)
    setTitle(pathway.title)
    setDescription(pathway.description)
    setIsPublished(pathway.isPublished)
    setSelectedResources(pathway.resources.map(r => r.resource))
    setResourceNotes(
      pathway.resources.reduce((acc, r) => ({
        ...acc,
        [r.resource.id]: r.notes || ''
      }), {})
    )
  }

  const handleAddResource = (resource: Resource) => {
    if (!selectedResources.find(r => r.id === resource.id)) {
      setSelectedResources([...selectedResources, resource])
    }
  }

  const handleRemoveResource = (resourceId: string) => {
    setSelectedResources(selectedResources.filter(r => r.id !== resourceId))
    const newNotes = { ...resourceNotes }
    delete newNotes[resourceId]
    setResourceNotes(newNotes)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    
    const items = Array.from(selectedResources)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    setSelectedResources(items)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || selectedResources.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields and add at least one resource',
        variant: 'destructive'
      })
      return
    }

    const pathwayData = {
      title,
      description,
      isPublished,
      resources: selectedResources.map((resource, index) => ({
        id: resource.id,
        notes: resourceNotes[resource.id] || ''
      }))
    }

    try {
      if (selectedPathway) {
        await fetch(`/api/admin/pathways/${selectedPathway.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pathwayData)
        })
      } else {
        await fetch('/api/admin/pathways', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pathwayData)
        })
      }

      toast({
        title: 'Success',
        description: `Pathway ${selectedPathway ? 'updated' : 'created'} successfully`
      })
      
      resetForm()
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save pathway',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/pathways/${id}`, {
        method: 'DELETE'
      })
      
      toast({
        title: 'Success',
        description: 'Pathway deleted successfully'
      })
      
      if (selectedPathway?.id === id) {
        resetForm()
      }
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete pathway',
        variant: 'destructive'
      })
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesContentType = contentTypeFilter.size === 0 || 
      contentTypeFilter.has(resource.contentType)

    return matchesSearch && matchesContentType
  })

  if (!session?.user?.isAdmin) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Pathways</h2>
        <ScrollArea className="h-[600px]">
          {pathways.map(pathway => (
            <Card
              key={pathway.id}
              className={`mb-4 cursor-pointer hover:shadow-md transition-all ${
                selectedPathway?.id === pathway.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelectPathway(pathway)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{pathway.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(pathway.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{pathway.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">
                    {pathway.resources.length} resource{pathway.resources.length === 1 ? '' : 's'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`published-${pathway.id}`} className="text-sm">Published</Label>
                    <Switch id={`published-${pathway.id}`} checked={pathway.isPublished} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedPathway ? 'Edit Pathway' : 'Create New Pathway'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="published">Published</Label>
          </div>

          <div>
            <Label>Resources</Label>
            <div className="flex flex-col space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {['Resource', 'Training', 'Shortcut', 'Plugin'].map(type => (
                    <Button
                      key={type}
                      variant={contentTypeFilter.has(type) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const newFilter = new Set(contentTypeFilter)
                        if (newFilter.has(type)) {
                          newFilter.delete(type)
                        } else {
                          newFilter.add(type)
                        }
                        setContentTypeFilter(newFilter)
                      }}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2">
                {filteredResources
                  .filter(r => !selectedResources.find(sr => sr.id === r.id))
                  .map(resource => (
                    <Card
                      key={resource.id}
                      className="cursor-pointer hover:shadow-md transition-all border-muted bg-card"
                      onClick={() => handleAddResource(resource)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-base leading-tight">{resource.title}</CardTitle>
                          <span className="flex-shrink-0 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                            {resource.contentType}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {resource.description}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddResource(resource)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Pathway
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Selected Resources</Label>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="resources">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {selectedResources.map((resource, index) => (
                      <Draggable
                        key={resource.id}
                        draggableId={resource.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex flex-col space-y-2 bg-card p-4 rounded-md border"
                          >
                            <div className="flex justify-between items-center">
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center space-x-2"
                              >
                                <GripVertical className="h-4 w-4" />
                                <span>{resource.title}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveResource(resource.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              placeholder="Add notes for this resource..."
                              value={resourceNotes[resource.id] || ''}
                              onChange={(e) =>
                                setResourceNotes({
                                  ...resourceNotes,
                                  [resource.id]: e.target.value
                                })
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedPathway ? 'Update' : 'Create'} Pathway
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 