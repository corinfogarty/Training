'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Search, Plus, Check, ArrowLeft, X, Trash } from 'lucide-react'
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
    resource: Resource
  }[]
}

export default function AdminPathways({ pathways, resources }: { pathways: Pathway[], resources: Resource[] }) {
  const [selectedResources, setSelectedResources] = useState<Resource[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [editingPathway, setEditingPathway] = useState<Pathway | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '' })
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  const handleStartEdit = (pathway: Pathway) => {
    setEditingPathway(pathway)
    setEditForm({
      title: pathway.title,
      description: pathway.description
    })
    setSelectedResources(pathway.resources.map(r => r.resource))
  }

  const handleSaveEdit = async () => {
    if (!editingPathway) return
    
    if (!editForm.title || !editForm.description) {
      toast({
        title: 'Error',
        description: 'Title and description are required',
        variant: 'destructive'
      })
      return
    }

    try {
      const endpoint = editingPathway.id 
        ? `/api/admin/pathways/${editingPathway.id}`
        : '/api/admin/pathways'
      
      const method = editingPathway.id ? 'PUT' : 'POST'

      const validResources = selectedResources.map((resource, index) => ({
        id: resource.id,
        order: index,
        notes: ''
      }))

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          resources: validResources,
          isPublished: editingPathway.isPublished
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save pathway')
      }

      toast({
        title: 'Success',
        description: editingPathway.id ? 'Pathway updated successfully' : 'Pathway created successfully',
      })
      
      router.refresh()
      setEditingPathway(null)
    } catch (error) {
      console.error('Error saving pathway:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save pathway',
        variant: 'destructive'
      })
    }
  }

  const handleAddResource = (resource: Resource) => {
    if (selectedResources.find(r => r.id === resource.id)) return
    setSelectedResources([...selectedResources, resource])
  }

  const handleRemoveResource = (resourceId: string) => {
    setSelectedResources(selectedResources.filter(r => r.id !== resourceId))
  }

  const handleDeletePathway = async (pathwayId: string, pathwayTitle: string) => {
    try {
      const response = await fetch(`/api/admin/pathways/${pathwayId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete pathway');
      }

      toast({
        title: 'Success',
        description: `Pathway "${pathwayTitle}" deleted successfully`,
      });
      
      router.refresh();
    } catch (error) {
      console.error('Error deleting pathway:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete pathway',
        variant: 'destructive'
      });
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategories = selectedCategories.size === 0 || 
      selectedCategories.has(resource.contentType)

    const matchesSelected = !showSelectedOnly || 
      selectedResources.some(r => r.id === resource.id)

    return matchesSearch && matchesCategories && matchesSelected
  })

  if (!session?.user?.isAdmin) {
    return null
  }

  if (editingPathway) {
    return (
      <div className="modal-dialog modal-lg" style={{ margin: 0, maxWidth: '100%', height: '100vh' }}>
        <div className="modal-content h-100">
          <div className="modal-header">
            <div className="modal-title h4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingPathway(null)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Pathways
              </Button>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setEditingPathway(null)} 
              aria-label="Close"
            />
          </div>

          <div className="modal-body" style={{ height: 'calc(100vh - 130px)', overflowY: 'auto', padding: '1.5rem' }}>
            <div className="space-y-4 border rounded-lg p-6 mb-4">
              <div>
                <Label htmlFor="title">Pathway Name</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter pathway name"
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter pathway description"
                  className="mt-1.5"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={editingPathway.isPublished}
                  onCheckedChange={(checked) => {
                    setEditingPathway({
                      ...editingPathway,
                      isPublished: checked
                    });
                  }}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </div>

            <div className="border rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Resources</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="showSelected"
                        checked={showSelectedOnly}
                        onCheckedChange={setShowSelectedOnly}
                      />
                      <Label htmlFor="showSelected">Show Selected Only</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(resources.map(r => r.contentType))).map(category => (
                      <Button
                        key={category}
                        variant={selectedCategories.has(category) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newCategories = new Set(selectedCategories)
                          if (newCategories.has(category)) {
                            newCategories.delete(category)
                          } else {
                            newCategories.add(category)
                          }
                          setSelectedCategories(newCategories)
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  <div className="border rounded-lg divide-y">
                    {filteredResources.map(resource => {
                      const isSelected = selectedResources.some(r => r.id === resource.id)
                      
                      return (
                        <div
                          key={resource.id}
                          className={`p-4 transition-colors ${
                            isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{resource.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  isSelected ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                                }`}>
                                  {resource.contentType}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (isSelected) {
                                  handleRemoveResource(resource.id)
                                } else {
                                  handleAddResource(resource)
                                }
                              }}
                              className="ml-4"
                            >
                              {isSelected ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button 
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 mr-auto"
              onClick={() => {
                if (confirm(`Are you sure you want to delete the pathway "${editingPathway.title}"? This action cannot be undone.`)) {
                  handleDeletePathway(editingPathway.id, editingPathway.title);
                  setEditingPathway(null);
                }
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Pathway
            </Button>
            <Button variant="outline" onClick={() => setEditingPathway(null)}>Cancel</Button>
            <Button 
              onClick={handleSaveEdit}
              disabled={!editForm.title || !editForm.description}
            >
              {editingPathway.id ? 'Save Changes' : 'Create Pathway'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Learning Pathways</h2>
        <Button onClick={() => {
          setEditingPathway({
            id: '',
            title: '',
            description: '',
            isPublished: false,
            resources: []
          })
          setEditForm({ title: '', description: '' })
          setSelectedResources([])
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Pathway
        </Button>
      </div>

      <div className="grid gap-4">
        {pathways.map(pathway => (
          <div 
            key={pathway.id} 
            className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
            onClick={() => handleStartEdit(pathway)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{pathway.title}</h3>
                  {pathway.isPublished ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {pathway.resources.length} resources
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartEdit(pathway)
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePathway(pathway.id, pathway.title);
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 