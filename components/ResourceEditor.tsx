'use client'

import React, { useState, useEffect } from 'react'
import { Resource, Category } from '@prisma/client'
import { Form, Button } from 'react-bootstrap'
import { Editor } from '@tinymce/tinymce-react'

// Use consistent local type definition
interface ResourceWithRelations extends Resource {
  category?: Category | null
  submittedBy?: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  } | null
  favoritedBy?: { id: string }[]
  completedBy?: { id: string }[]
}

interface ResourceEditorProps {
  resource: ResourceWithRelations
  onSave: () => void
  onCancel: () => void
}

export default function ResourceEditor({
  resource,
  onSave,
  onCancel
}: ResourceEditorProps) {
  const [title, setTitle] = useState(resource?.title || '')
  const [url, setUrl] = useState(resource?.url || '')
  const [description, setDescription] = useState(resource?.description || '')
  const [previewImage, setPreviewImage] = useState(resource?.previewImage || '')
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Use an earlier check for editor availability - check as soon as component mounts
  useEffect(() => {
    // First, check if TinyMCE global is available
    const tinyMCEAvailable = typeof window !== 'undefined' && 'tinymce' in window;
    
    // If tinymce isn't available after 300ms, show fallback immediately
    if (!tinyMCEAvailable) {
      const quickTimeoutId = setTimeout(() => {
        const fallbackTextarea = document.querySelector('.tinymce-fallback');
        if (fallbackTextarea) {
          (fallbackTextarea as HTMLElement).style.display = 'block';
          console.log('TinyMCE not available, showing fallback immediately');
        }
      }, 300);
      
      return () => clearTimeout(quickTimeoutId);
    }
    
    // Still keep the longer timeout for cases where TinyMCE is available but fails to initialize
    const timeoutId = setTimeout(() => {
      const editorContainer = document.querySelector('.tox-tinymce[data-loaded="true"]');
      const fallbackTextarea = document.querySelector('.tinymce-fallback');
      
      if (!editorContainer && fallbackTextarea) {
        (fallbackTextarea as HTMLElement).style.display = 'block';
        console.warn('TinyMCE failed to load properly, using fallback textarea');
      }
    }, 1500);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  useEffect(() => {
    // Update form when resource changes
    if (resource) {
      setTitle(resource.title || '')
      setUrl(resource.url || '')
      setDescription(resource.description || '')
      setPreviewImage(resource.previewImage || '')
    }
  }, [resource])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setErrorMessage('Title is required')
      return
    }
    
    try {
      setIsSaving(true)
      
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          url,
          description,
          previewImage,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update resource')
      }
      
      onSave()
    } catch (error) {
      console.error('Error updating resource:', error)
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="resource-editor">
      <h2>Edit Resource</h2>
      
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resource Title"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Preview Image URL</Form.Label>
          <Form.Control
            type="url"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {previewImage && (
            <div className="mt-2">
              <img 
                src={previewImage} 
                alt="Preview" 
                style={{ maxHeight: '100px', maxWidth: '100%' }} 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <div className="position-relative">
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "k8fzh2z7v1akjnv2yo197wht8fe2gv9ml9qn0lgc8li8298r"}
              value={description}
              onEditorChange={(content) => setDescription(content)}
              init={{
                height: 300,
                menubar: false,
                disabled: false,
                statusbar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | link image | removeformat | help',
                setup: function(editor) {
                  editor.on('init', function() {
                    const editorContainer = document.querySelector('.tox-tinymce');
                    if (editorContainer) {
                      editorContainer.setAttribute('data-loaded', 'true');
                    }
                  });
                }
              }}
            />
            
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ 
                height: '300px',
                display: 'none'
              }}
              className="tinymce-fallback"
            />
          </div>
        </Form.Group>
        
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  )
} 