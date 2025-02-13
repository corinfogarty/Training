'use client'

import { useState, useEffect } from 'react'
import { Category, ContentType } from '@prisma/client'
import { Button, Modal, Form, Alert } from 'react-bootstrap'
import { Editor } from '@tinymce/tinymce-react'
import { Link as LinkIcon, FileIcon } from 'lucide-react'

interface AddResourceButtonProps {
  categoryId?: string
  onResourceAdded?: () => void
}

export default function AddResourceButton({ categoryId, onResourceAdded }: AddResourceButtonProps) {
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [previewImage, setPreviewImage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    categoryId: categoryId || '',
    contentType: '' as ContentType | '',
  })

  // Add URL validation helper
  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (show) {
      fetchCategories()
    }
  }, [show])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
      if (categoryId) {
        const category = data.find((c: Category) => c.id === categoryId)
        setSelectedCategory(category || null)
      }
    } catch (err) {
      setError('Failed to load categories')
    }
  }

  const fetchUrlPreview = async (url: string) => {
    if (!url || !isValidUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    setError(null);
    setImageLoading(true);
    setImageError(false);
    try {
      setLoading(true);
      const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Failed to fetch preview');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Log preview data for debugging
      console.log('Preview data:', data);
      
      // Try different image sources in order of preference
      const imagesToTry = [
        data.image,
        data.ogImage,
        data.twitterImage,
        data.favicon,
        ...(data.images || [])
      ].filter(Boolean);

      console.log('Available images to try:', imagesToTry);

      // Try each image until one works
      let imageSet = false;
      for (const imgUrl of imagesToTry) {
        if (!imgUrl) continue;
        
        try {
          // Pre-load the image
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imgUrl;
          });
          
          // If we get here, the image loaded successfully
          console.log('Successfully loaded image:', imgUrl);
          setPreviewImage(imgUrl);
          setImageError(false);
          imageSet = true;
          break;
        } catch (err) {
          console.log('Failed to load image:', imgUrl);
          continue;
        }
      }

      if (!imageSet) {
        console.log('No valid images found');
        setImageError(true);
      }

      // Only update title and description if they're empty
      setFormData(prev => ({ 
        ...prev, 
        title: prev.title || data.title || '',
        description: prev.description || data.description || ''
      }));

    } catch (error) {
      console.error('Error fetching preview:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch preview data');
      setImageError(true);
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const content = {
        title: formData.title,
        description: formData.description,
        credentials: {},
        courseContent: []
      }

      const data = {
        title: formData.title,
        description: JSON.stringify(content),
        url: formData.url,
        categoryId: formData.categoryId,
        previewImage: previewImage || selectedCategory?.defaultImage || '',
        additionalUrls: [],
        contentType: formData.contentType as ContentType,
      }

      if (!data.title || !data.description || !data.url || !data.categoryId || !data.contentType) {
        throw new Error('All fields are required')
      }

      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to add resource')
      }

      setShow(false)
      if (onResourceAdded) {
        onResourceAdded()
      }
    } catch (err) {
      console.error('Error creating resource:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId }))
    const category = categories.find(c => c.id === categoryId)
    setSelectedCategory(category || null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload file')
      
      const data = await response.json()
      setPreviewImage(data.url)
    } catch (err) {
      console.error('Error uploading file:', err)
      setError('Failed to upload image')
    }
  }

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Add Resource
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Control
                type="url"
                value={formData.url}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, url: e.target.value }));
                  setError(null); // Clear error on change
                }}
                onBlur={(e) => {
                  const url = e.target.value.trim();
                  if (url) fetchUrlPreview(url);
                }}
                required
                placeholder="Enter URL"
                pattern="https?://.+"
                title="Please enter a valid URL starting with http:// or https://"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="position-relative">
                {imageLoading ? (
                  <div 
                    className="d-flex align-items-center justify-content-center bg-light rounded"
                    style={{ height: '200px' }}
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <img 
                      key={previewImage} // Force re-render when image changes
                      src={previewImage || selectedCategory?.defaultImage || ''}
                      alt="Preview"
                      className="img-fluid rounded shadow-sm w-100"
                      style={{ 
                        height: '200px',
                        objectFit: previewImage?.includes('svg') ? 'contain' : 'cover',
                        backgroundColor: '#f8f9fa',
                        display: imageError ? 'none' : 'block',
                        padding: previewImage?.includes('svg') ? '1rem' : '0'
                      }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        console.log('Image failed to load:', previewImage);
                        setImageError(true);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', previewImage);
                        setImageError(false);
                      }}
                    />
                    {imageError && (
                      <div 
                        className="d-flex align-items-center justify-content-center bg-light rounded"
                        style={{ height: '200px' }}
                      >
                        <div className="text-muted">No preview available</div>
                      </div>
                    )}
                  </>
                )}
                <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => fetchUrlPreview(formData.url)}
                    disabled={!formData.url || loading}
                    title="Fetch image from URL"
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                  >
                    <LinkIcon size={16} />
                  </Button>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="d-none"
                    id="preview-image-upload"
                    aria-label="Choose preview image file"
                  />
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => document.getElementById('preview-image-upload')?.click()}
                    title="Upload image file"
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                  >
                    <FileIcon size={16} />
                  </Button>
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Enter title"
                className="h4 border-0 p-0"
                style={{ fontSize: '1.5rem', fontWeight: 600 }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={formData.description}
                onEditorChange={(content) => {
                  setFormData(prev => ({ ...prev, description: content }))
                }}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
            </Form.Group>

            {!categoryId && (
              <Form.Group className="mb-4">
                <Form.Select
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                  aria-label="Select category"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-4">
              <Form.Select
                value={formData.contentType}
                onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value as ContentType }))}
                required
                aria-label="Select content type"
              >
                <option value="">Select Type</option>
                <option value="Resource">Resource</option>
                <option value="Training">Training</option>
                <option value="Shortcut">Shortcut</option>
                <option value="Plugin">Plugin</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Resource'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}