'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Resource, Category, ContentType } from '@prisma/client'
import { Modal, Button, Badge, Form } from 'react-bootstrap'
import { ExternalLink, Calendar, Link as LinkIcon, Edit, Star, CheckCircle, List, Link2, FileIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Editor } from '@tinymce/tinymce-react'
import ResourceEditor from './ResourceEditor'

// Define local resource type that matches the existing implementation
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

interface ResourceLightboxProps {
  resource: ResourceWithRelations
  show: boolean
  onHide: () => void
  isFavorite: boolean
  isCompleted: boolean
  onToggleFavorite: () => void
  onToggleComplete: () => void
  startInEditMode?: boolean
}

interface FormattedContent {
  title: string
  description: string
  courseContent?: string[]
  url?: string
}

export default function ResourceLightbox({
  resource,
  show,
  onHide,
  isFavorite,
  isCompleted,
  onToggleFavorite,
  onToggleComplete,
  startInEditMode = false,
}: ResourceLightboxProps) {
  const { data: session } = useSession()
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [completeLoading, setCompleteLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentResource, setCurrentResource] = useState<ResourceWithRelations>(resource)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Add ref to track previous image URL
  const previousImage = useRef<string | null | undefined>(null);

  // Set initial editing state based on the startInEditMode prop
  useEffect(() => {
    if (startInEditMode && show) {
      console.log('🔍 Starting in edit mode due to startInEditMode prop');
      // Need to fetch categories before editing
      fetchCategories()
        .then(() => {
          console.log('✅ Categories fetched for startInEditMode');
          setIsEditing(true);
        })
        .catch(err => {
          console.error('❌ Error fetching categories for startInEditMode:', err);
          // Still set editing mode even if categories fail
          setIsEditing(true);
        });
    }
  }, [startInEditMode, show]);

  useEffect(() => {
    setCurrentResource(resource)
    // Only reset imageLoaded if the previewImage URL has actually changed
    if (resource?.previewImage !== previousImage.current) {
      setImageLoaded(false);
    }
    previousImage.current = resource?.previewImage; // Update previous value

    // Reset editing state when resource changes IF the modal is already open
    if (show) {
        setIsEditing(false);
    }
  }, [resource, show])

  useEffect(() => {
    if (isEditing) {
      fetchCategories()
    }
  }, [isEditing])

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        if (isEditing) {
          setIsEditing(false)
        } else {
          onHide()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [show, onHide, isEditing])

  useEffect(() => {
    // Notify parent on editing mode changes
    console.log('🔍 isEditing state changed to:', isEditing);
    
    if (isEditing === false && show) {
      // If we just finished editing, refresh the parent
      console.log('✅ Exited editing mode, refreshing parent');
      // This is a good place to trigger a refresh if needed
    }
  }, [isEditing, show]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError('Failed to load categories')
    }
  }

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default behavior and stop event propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('🔍 Edit button clicked, current isEditing state:', isEditing);
    
    try {
      // First fetch categories to ensure we have the data before switching modes
      console.log('🔍 Fetching categories...');
      fetchCategories()
        .then(() => {
          console.log('✅ Categories fetched successfully, setting isEditing to true');
          // Only set editing state after categories are loaded
          setIsEditing(true);
          
          // Log state change
          setTimeout(() => {
            console.log('✅ New isEditing state:', isEditing, 'Should be switching to editor view');
          }, 100);
        })
        .catch(error => {
          console.error('❌ Error fetching categories:', error);
          // Still set editing even if categories fail - better UX
          setIsEditing(true);
        });
    } catch (error) {
      console.error('❌ Unexpected error in handleEdit:', error);
      // Fallback - set editing mode anyway
      setIsEditing(true);
    }
  }

  const handleEditCancel = () => {
    setCurrentResource(resource)
    setIsEditing(false)
  }

  const handleModalHide = () => {
    if (!isEditing) {
      onHide()
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from reaching overlay backdrop
    console.log('Favorite button clicked');
    
    if (!onToggleFavorite) return
    setFavoriteLoading(true)
    try {
      await onToggleFavorite()
      console.log('Toggled favorite successfully');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleCompleteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from reaching overlay backdrop
    console.log('Complete button clicked');
    
    if (!onToggleComplete) return
    setCompleteLoading(true)
    try {
      await onToggleComplete()
      console.log('Toggled complete successfully');
    } catch (error) {
      console.error('Error toggling complete:', error);
    } finally {
      setCompleteLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setCurrentResource(prev => ({ ...prev, previewImage: previewUrl }))
    }
  }

  const handleFetchPreview = async () => {
    if (!currentResource?.url) return;
    
    try {
      setPreviewLoading(true);
      const response = await fetch(`/api/preview?url=${encodeURIComponent(currentResource.url)}`);
      if (!response.ok) throw new Error('Failed to fetch preview');
      const data = await response.json();
      
      const decodedImageUrl = data.image ? decodeURIComponent(data.image.replace(/&amp;/g, '&')) : '';
      
      setCurrentResource(prev => ({
        ...prev,
        previewImage: decodedImageUrl,
        description: data.description || prev.description
      }));
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)

    if (!currentResource?.id) {
      console.error('No resource ID found')
      return
    }

    try {
      let finalPreviewImage = currentResource.previewImage

      // If a file is selected, upload it first
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload preview image')
        }

        const { path } = await uploadResponse.json()
        finalPreviewImage = path
      }

      const response = await fetch(`/api/resources/${currentResource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: currentResource.title,
          description: currentResource.description,
          url: currentResource.url,
          contentType: currentResource.contentType,
          categoryId: currentResource.categoryId,
          previewImage: finalPreviewImage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update resource')
      }

      const updatedResource = await response.json()
      setCurrentResource(updatedResource)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating resource:', error)
      setError(error instanceof Error ? error.message : 'Failed to update resource')
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && show && !isEditing) {
      onHide()
    }
  }

  // Don't render at all if not showing (prevents flash)
  if (!show) {
    return null;
  }

  // Track if we're in editing mode
  const shouldShowEditor = isEditing === true;
  console.log('ResourceLightbox rendering, isEditing:', isEditing, 'shouldShowEditor:', shouldShowEditor);

  // Always return the same overlay structure, but conditionally render either the editor or viewer inside
  return (
    <div 
      className={`resource-overlay ${show ? 'resource-overlay-visible' : ''}`}
      ref={overlayRef}
      onClick={handleBackdropClick}
    >
      <div className={`resource-content ${shouldShowEditor ? 'editing-mode' : ''} d-flex flex-column`} style={{ maxHeight: '90vh' }}>
        <button 
          className="close-button" 
          onClick={shouldShowEditor ? () => setIsEditing(false) : handleModalHide}
          aria-label="Close"
        >
          ×
        </button>
        
        {shouldShowEditor ? (
          // EDITOR VIEW - show when isEditing is true
          <>
            <Button 
              variant="link" 
              className="back-button" 
              onClick={() => {
                console.log('🔍 Back button clicked, returning to resource view');
                setIsEditing(false);
              }}
            >
              Back to resource
            </Button>
            
            <ResourceEditor 
              resource={currentResource} 
              onSave={() => {
                console.log('🔍 ResourceEditor save callback, setting isEditing to false');
                setIsEditing(false);
              }} 
              onCancel={() => {
                console.log('🔍 ResourceEditor cancel callback');
                handleEditCancel();
              }} 
            />
          </>
        ) : (
          // VIEWER VIEW - show when isEditing is false
          <>
            <div className="d-flex flex-column flex-md-row flex-wrap align-items-start align-items-md-center border-bottom pb-3 mb-3 gap-2 pe-5">
              <div className="d-flex flex-wrap gap-1 order-1" style={{ minWidth: '100px' }}>
                 {currentResource?.category?.name && (
                   <Badge pill bg="primary" text="white" className="px-2 py-1 small">
                      {currentResource.category.name}
                   </Badge>
                 )}
                 {currentResource?.contentType && (
                   <Badge pill bg="secondary" text="white" className="px-2 py-1 small">
                     {currentResource.contentType}
                   </Badge>
                 )}
               </div>
               <div className="flex-grow-1 d-none d-md-block order-2"></div>
               {currentResource?.submittedBy && (
                  <div className="d-flex align-items-center gap-1 text-muted small order-3 order-md-2">
                    {currentResource.submittedBy.image ? (
                      <img
                        src={currentResource.submittedBy.image}
                        alt={currentResource.submittedBy.name || 'User'}
                        className="rounded-circle"
                        width={20}
                        height={20}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                        style={{ width: '20px', height: '20px', fontSize: '10px' }}
                      >
                        {currentResource.submittedBy.name?.[0] || currentResource.submittedBy.email[0]}
                      </div>
                    )}
                    <span>
                      Added by {currentResource.submittedBy.name || currentResource.submittedBy.email.split('@')[0]}
                      {currentResource.createdAt && ` on ${new Date(currentResource.createdAt).toLocaleDateString()}`}
                    </span>
                  </div>
               )}
               {/* Icon Buttons */}
               <div className="d-flex gap-1 order-2 order-md-3 ms-md-2">
                  <Button
                    variant="link"
                    className={`p-1 lh-1 ${favoriteLoading ? 'disabled' : ''}`}
                    onClick={(e) => handleFavoriteClick(e)}
                    disabled={favoriteLoading}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-warning' : 'text-muted'} />
                  </Button>
                  <Button
                    variant="link"
                    className={`p-1 lh-1 ${completeLoading ? 'disabled' : ''}`}
                    onClick={(e) => handleCompleteClick(e)}
                    disabled={completeLoading}
                    title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                  >
                    <CheckCircle size={18} fill={isCompleted ? 'currentColor' : 'none'} className={isCompleted ? 'text-success' : 'text-muted'} />
                  </Button>
                  {(session?.user?.isAdmin || session?.user?.id === currentResource?.submittedBy?.id) && (
                    <Button
                      variant="link"
                      className="p-1 lh-1 text-muted"
                      onClick={(e) => handleEdit(e)}
                      title="Edit resource"
                    >
                      <Edit size={18} />
                    </Button>
                  )}
                </div>
             </div>
    
            <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '10px' }}>
                <h2 className="mb-3 h4">{currentResource?.title || ''}</h2>
    
                {currentResource?.previewImage && (
                  <div className="mb-4 text-center">
                    {!imageLoaded && (
                      <div className="image-placeholder d-flex justify-content-center align-items-center bg-light rounded mx-auto" style={{ height: '250px', width: '100%', maxWidth: '500px' }}>
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading image...</span>
                        </div>
                      </div>
                    )}
                    <img
                      src={currentResource.previewImage}
                      alt={currentResource.title || 'Resource preview'}
                      className={`img-fluid rounded shadow-sm mx-auto ${imageLoaded ? '' : 'd-none'}`}
                      style={{ maxHeight: '400px', width: 'auto', objectFit: 'contain' }}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        console.warn(`Image failed to load: ${currentResource.previewImage}`);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const placeholder = document.createElement('div');
                          placeholder.style.width = '300px';
                          placeholder.style.height = '200px';
                          placeholder.style.backgroundColor = '#e9ecef';
                          placeholder.style.display = 'flex';
                          placeholder.style.alignItems = 'center';
                          placeholder.style.justifyContent = 'center';
                          placeholder.style.margin = '0 auto';
                          placeholder.style.borderRadius = '8px';
                          placeholder.innerHTML = '<div style="color:#6c757d;font-family:system-ui,-apple-system,sans-serif;">Resource preview</div>';
                          parent.appendChild(placeholder);
                          target.onerror = null;
                        }
                        setImageLoaded(true);
                      }}
                    />
                  </div>
                )}
    
                <div className="resource-description mb-4">
                  {currentResource?.description ? (
                     <div dangerouslySetInnerHTML={{ __html: currentResource.description }} />
                  ) : (
                     <p className="text-muted">No description available.</p>
                  )}
                </div>
            </div>
    
            {currentResource?.url && (
              <div className="resource-footer border-top pt-3 mt-auto">
                <a
                  href={currentResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-100 btn-lg d-flex align-items-center justify-content-center gap-2"
                >
                  Visit Resource <ExternalLink size={18} />
                </a>
              </div>
            )}
          </>
        )}
      </div>
      
      <style jsx>{`
        .resource-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          pointer-events: none;
        }
        
        .resource-overlay-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        
        .resource-content {
          background: white;
          border-radius: 8px;
          max-width: 800px;
          width: 95%;
          position: relative;
          padding: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          transform: translateY(20px);
          transition: transform 0.3s ease;
          overflow: hidden;
        }
        
        .resource-overlay-visible .resource-content {
          transform: translateY(0);
        }
        
        .editing-mode {
          max-width: 900px;
          width: 98%;
        }
        
        .close-button {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          color: #6c757d;
          opacity: 0.75;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 10;
        }
        
        .close-button:hover {
           opacity: 1;
           color: #000;
        }
        
        .back-button {
          margin-bottom: 15px;
          color: #666;
          padding-left: 0;
        }
        
        .resource-description {
          margin-bottom: 20px;
        }
        
        .resource-description :global(a) {
            color: var(--bs-link-color);
            text-decoration: underline;
         }
         .resource-description :global(a:hover) {
            color: var(--bs-link-hover-color);
         }
         .resource-footer {
         }
      `}</style>
    </div>
  )
} 