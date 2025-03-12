import { apiUrl } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const titleInput = document.getElementById('title');
  const urlInput = document.getElementById('url');
  const descriptionInput = document.getElementById('description');
  const categorySelect = document.getElementById('category');
  const contentTypeSelect = document.getElementById('contentType');
  const submitButton = document.getElementById('submit');
  const messageDiv = document.getElementById('message');
  const previewImageEl = document.getElementById('preview-image');
  const fetchPreviewBtn = document.getElementById('fetch-preview');
  const uploadImageBtn = document.getElementById('upload-image');
  const fileInput = document.getElementById('file-input');
  
  let previewImage = null;
  let previewLoading = false;
  let submitLoading = false;

  function setLoading(loading) {
    if (loading) {
      document.body.classList.add('loading');
      submitButton.disabled = true;
    } else {
      document.body.classList.remove('loading');
      submitButton.disabled = false;
    }
  }

  function updatePreviewImage(imageUrl) {
    if (!imageUrl) {
      previewImage = chrome.runtime.getURL('public/default.png');
      previewImageEl.src = previewImage;
      previewImageEl.style.display = 'block';
      return;
    }

    // Create a new image to test loading
    const img = new Image();
    img.onload = () => {
      previewImage = imageUrl;
      previewImageEl.src = imageUrl;
      previewImageEl.style.display = 'block';
    };
    img.onerror = () => {
      console.error('Failed to load image:', imageUrl);
      previewImage = chrome.runtime.getURL('public/default.png');
      previewImageEl.src = previewImage;
      previewImageEl.style.display = 'block';
    };
    img.src = imageUrl;
  }

  async function getPageMetadata() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error('No active tab found');

      // Check if we have permission to access the tab
      const url = new URL(tab.url || '');
      if (!url.protocol.startsWith('http')) {
        return {
          url: '',
          title: tab.title || '',
          description: '',
          image: ''
        };
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const getMetaContent = (selectors) => {
            try {
              for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                  if (element?.content) {
                    return element.content.trim();
                  }
                }
              }
            } catch (e) {
              console.error('Error getting meta content:', e);
            }
            return null;
          };

          // Get all possible images from the page
          const getAllImages = () => {
            try {
              // Get meta images first
              const ogImage = document.querySelector('meta[property="og:image"]')?.content;
              const twitterImage = document.querySelector('meta[name="twitter:image"]')?.content;
              const twitterImageAlt = document.querySelector('meta[property="twitter:image"]')?.content;
              
              // Get all og:image tags (some pages have multiple)
              const allOgImages = Array.from(document.querySelectorAll('meta[property="og:image"]'))
                .map(el => el.content)
                .filter(Boolean);

              // Get all article:image tags
              const articleImages = Array.from(document.querySelectorAll('meta[property="article:image"]'))
                .map(el => el.content)
                .filter(Boolean);

              // Get schema.org image
              const schemaImage = document.querySelector('meta[itemprop="image"]')?.content;

              // Get the largest visible image from the page
              let largestImage = null;
              let maxArea = 0;
              document.querySelectorAll('img').forEach(img => {
                // Check if image is visible and reasonably sized
                const rect = img.getBoundingClientRect();
                const style = window.getComputedStyle(img);
                const isVisible = style.display !== 'none' && 
                                style.visibility !== 'hidden' && 
                                rect.width > 50 && 
                                rect.height > 50;

                if (isVisible && img.src && !img.src.includes('data:')) {
                  const area = rect.width * rect.height;
                  if (area > maxArea) {
                    maxArea = area;
                    largestImage = img.src;
                  }
                }
              });

              // Get high-res favicon or apple touch icon
              const getHighResIcon = () => {
                const selectors = [
                  'link[rel="apple-touch-icon"]',
                  'link[rel="apple-touch-icon-precomposed"]',
                  'link[sizes="192x192"]',
                  'link[sizes="180x180"]',
                  'link[rel="icon"][sizes="32x32"]',
                  'link[rel="shortcut icon"]',
                  'link[rel="icon"]'
                ];

                for (const selector of selectors) {
                  const icon = document.querySelector(selector);
                  if (icon?.href) {
                    return new URL(icon.href, window.location.href).href;
                  }
                }
                return new URL('/favicon.ico', window.location.href).href;
              };

              // Combine all images and remove duplicates
              const allImages = [
                ...allOgImages,
                twitterImage,
                twitterImageAlt,
                schemaImage,
                ...articleImages,
                largestImage,
                getHighResIcon()
              ]
                .filter(Boolean)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map(url => {
                  try {
                    return new URL(url, window.location.href).href;
                  } catch (e) {
                    console.error('Invalid URL:', url);
                    return null;
                  }
                })
                .filter(Boolean);

              console.log('Found images:', allImages);
              return allImages;
            } catch (e) {
              console.error('Error getting images:', e);
              return [];
            }
          };

          // Get clean URL without query parameters
          const getCleanUrl = () => {
            try {
              const url = new URL(window.location.href);
              return `${url.origin}${url.pathname}`;
            } catch (e) {
              console.error('Error getting clean URL:', e);
              return window.location.href;
            }
          };

          // Get clean description
          const getDescription = () => {
            try {
              const description = getMetaContent([
                'meta[name="description"]',
                'meta[property="og:description"]',
                'meta[name="twitter:description"]'
              ]);
              return description ? description.split('\n')[0].trim() : '';
            } catch (e) {
              console.error('Error getting description:', e);
              return '';
            }
          };

          return {
            url: getCleanUrl(),
            title: document.title?.split('|')[0].trim() || '',
            description: getDescription(),
            images: getAllImages()
          };
        }
      });

      if (!results?.[0]?.result) {
        throw new Error('No results from script execution');
      }

      const metadata = results[0].result;
      console.log('Extracted metadata:', metadata);

      // Helper to check if URL is an SVG
      const isSvg = (url) => {
        return url.toLowerCase().endsWith('.svg') || url.includes('svg+xml');
      };

      // Helper to check if URL is a small icon
      const isSmallIcon = (url) => {
        const iconPatterns = [
          'favicon',
          'icon',
          'logo',
          'windows-phone',
          'apple-touch',
          '/icons/',
          'blocks_84x24'
        ];
        return iconPatterns.some(pattern => url.toLowerCase().includes(pattern));
      };

      // Group images by type
      const groupedImages = {
        og: metadata.images.filter(url => url.includes('og:image')),
        twitter: metadata.images.filter(url => url.includes('twitter:image')),
        article: metadata.images.filter(url => url.includes('article:image')),
        schema: metadata.images.filter(url => url.includes('schema.org')),
        other: metadata.images.filter(url => {
          return !url.includes('og:image') && 
                 !url.includes('twitter:image') && 
                 !url.includes('article:image') &&
                 !url.includes('schema.org');
        })
      };

      // Test image and get its dimensions
      const testImage = async (url) => {
        try {
          const img = new Image();
          const dimensions = await new Promise((resolve, reject) => {
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = url;
          });
          return { url, ...dimensions, valid: true };
        } catch (e) {
          console.error('Error loading image:', url, e);
          return { url, valid: false };
        }
      };

      // Find best image from a group
      const findBestImage = async (images) => {
        const results = await Promise.all(images.map(testImage));
        const validImages = results.filter(img => img.valid);
        
        // Sort by area, preferring non-SVG and non-icon images
        return validImages.sort((a, b) => {
          const aScore = (a.width * a.height) * (isSvg(a.url) || isSmallIcon(a.url) ? 0.1 : 1);
          const bScore = (b.width * b.height) * (isSvg(b.url) || isSmallIcon(b.url) ? 0.1 : 1);
          return bScore - aScore;
        })[0]?.url;
      };

      // Try to find the best image in order of preference
      let validImage = null;
      for (const group of ['og', 'twitter', 'article', 'schema', 'other']) {
        if (groupedImages[group].length) {
          validImage = await findBestImage(groupedImages[group]);
          if (validImage && !isSmallIcon(validImage)) {
            console.log(`Found valid image from ${group} group:`, validImage);
            break;
          }
        }
      }

      // If we only found an icon, try again without excluding icons
      if (!validImage) {
        for (const group of ['og', 'twitter', 'article', 'schema', 'other']) {
          if (groupedImages[group].length) {
            validImage = await findBestImage(groupedImages[group]);
            if (validImage) {
              console.log(`Found fallback image from ${group} group:`, validImage);
              break;
            }
          }
        }
      }

      return {
        url: metadata.url,
        title: metadata.title,
        description: metadata.description,
        image: validImage
      };
    } catch (error) {
      console.error('Error getting page metadata:', error);
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      return {
        url: tab?.url || '',
        title: tab?.title?.split('|')[0].trim() || '',
        description: '',
        image: ''
      };
    }
  }

  async function fetchUrlPreview(url) {
    if (!url) return;
    
    try {
      setLoading(true);
      previewLoading = true;
      
      // Clean the URL before sending
      const cleanUrl = new URL(url);
      const previewUrl = `${cleanUrl.origin}${cleanUrl.pathname}`;
      
      const response = await fetch(`${apiUrl}/api/preview?url=${encodeURIComponent(previewUrl)}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch preview');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.description && !descriptionInput.value) {
        // Clean up description - take only first paragraph
        const cleanDescription = data.description.split('\n')[0].trim();
        descriptionInput.value = cleanDescription;
      }
      
      if (data.title && !titleInput.value) {
        // Clean up title - remove site name if present
        titleInput.value = data.title.split('|')[0].trim();
      }
      
      if (data.image && !previewImage) {
        updatePreviewImage(data.image);
      }
    } catch (error) {
      console.error('Preview error:', error);
      messageDiv.textContent = error.message || 'Error fetching preview';
      messageDiv.className = 'error';
      updatePreviewImage(null); // Clear preview image on error
    } finally {
      setLoading(false);
      previewLoading = false;
    }
  }

  // Initialize form with current page data
  async function initializeForm() {
    try {
      setLoading(true);
      
      // Get metadata from the current page
      const pageData = await getPageMetadata();
      console.log('Page metadata:', pageData);
      
      // Set initial values
      urlInput.value = pageData.url;
      titleInput.value = pageData.title;
      
      // If we got metadata from the page, use it
      if (pageData.description) {
        descriptionInput.value = pageData.description;
      }
      
      let hasValidImage = false;
      if (pageData.image) {
        // Test if the image loads
        const img = new Image();
        img.onload = () => {
          updatePreviewImage(pageData.image);
          hasValidImage = true;
        };
        img.src = pageData.image;
      }
      
      // Only fetch preview if we don't have a valid image
      if (!hasValidImage) {
        await fetchUrlPreview(pageData.url);
      }
      
    } catch (error) {
      console.error('Error initializing form:', error);
      messageDiv.textContent = 'Error loading page data';
      messageDiv.className = 'error';
    } finally {
      setLoading(false);
    }
  }

  // Initialize the form
  await initializeForm();

  // Fetch categories
  try {
    const response = await fetch(`${apiUrl}/api/categories`, {
      credentials: 'include'
    });
    const categories = await response.json();
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Categories error:', error);
    messageDiv.textContent = 'Error loading categories';
    messageDiv.className = 'error';
  }

  // Event Listeners
  urlInput.addEventListener('change', () => fetchUrlPreview(urlInput.value));
  fetchPreviewBtn.addEventListener('click', () => fetchUrlPreview(urlInput.value));
  
  uploadImageBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload file');
      
      const data = await response.json();
      updatePreviewImage(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      messageDiv.textContent = error.message || 'Error uploading image';
      messageDiv.className = 'error';
    } finally {
      setLoading(false);
    }
  });

  submitButton.addEventListener('click', async () => {
    if (submitLoading) return;
    
    if (!titleInput.value || !urlInput.value || !categorySelect.value || !contentTypeSelect.value) {
      messageDiv.textContent = 'Please fill in all required fields';
      messageDiv.className = 'error';
      return;
    }

    try {
      submitLoading = true;
      setLoading(true);
      submitButton.textContent = 'Adding...';

      const content = {
        title: titleInput.value,
        description: descriptionInput.value || titleInput.value,
        credentials: {},
        courseContent: []
      };

      // Validate content type (ensure it's one of the expected values)
      const validContentTypes = ['Resource', 'Training', 'Shortcut', 'Plugin'];
      const contentType = contentTypeSelect.value;
      
      if (!validContentTypes.includes(contentType)) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      const data = {
        title: titleInput.value,
        url: urlInput.value,
        description: JSON.stringify(content),
        categoryId: categorySelect.value,
        contentType: contentType,
        previewImage: previewImage || chrome.runtime.getURL('public/default.png'),
        additionalUrls: []
      };

      console.log('Sending data:', data);

      const response = await fetch(`${apiUrl}/api/resources`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('Response:', response.status, await response.clone().json());

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to add resource');
      }

      messageDiv.textContent = 'Resource added successfully!';
      messageDiv.className = 'success';
      
      // Clear form
      titleInput.value = '';
      urlInput.value = '';
      descriptionInput.value = '';
      categorySelect.value = '';
      contentTypeSelect.value = '';
      updatePreviewImage(null);
      
    } catch (error) {
      console.error('Submit error:', error);
      messageDiv.textContent = error.message || 'Error adding resource';
      messageDiv.className = 'error';
    } finally {
      submitLoading = false;
      setLoading(false);
      submitButton.textContent = 'Add Resource';
    }
  });
}); 