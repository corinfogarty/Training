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
      previewImage = null;
      previewImageEl.style.display = 'none';
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
      previewImage = null;
      previewImageEl.style.display = 'none';
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

      // Request permissions if needed
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => true // Test if we can execute scripts
        });
      } catch (permError) {
        console.error('Permission error:', permError);
        // Return basic tab data if we can't execute scripts
        return {
          url: tab.url || '',
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
                const element = document.querySelector(selector);
                if (element?.content) {
                  return element.content.trim();
                }
              }
            } catch (e) {
              console.error('Error getting meta content:', e);
            }
            return null;
          };

          // Get favicon with absolute URL
          const getFavicon = () => {
            try {
              const iconLink = document.querySelector('link[rel*="icon"]');
              if (iconLink?.href) {
                return new URL(iconLink.href, window.location.href).href;
              }
              return new URL('/favicon.ico', window.location.href).href;
            } catch (e) {
              console.error('Error getting favicon:', e);
              return null;
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

          // Get image URL
          const getImageUrl = (url) => {
            if (!url) return null;
            try {
              return new URL(url, window.location.href).href;
            } catch (e) {
              console.error('Error getting image URL:', e);
              return null;
            }
          };

          try {
            const imageUrl = getMetaContent([
              'meta[property="og:image"]',
              'meta[name="twitter:image"]',
              'meta[property="twitter:image"]'
            ]);

            return {
              url: getCleanUrl(),
              title: document.title?.split('|')[0].trim() || '',
              description: getDescription(),
              image: getImageUrl(imageUrl) || getFavicon()
            };
          } catch (e) {
            console.error('Error getting page data:', e);
            return {
              url: window.location.href,
              title: document.title || '',
              description: '',
              image: null
            };
          }
        }
      });

      if (!results?.[0]?.result) {
        throw new Error('No results from script execution');
      }

      const metadata = results[0].result;
      console.log('Extracted metadata:', metadata);
      return metadata;
    } catch (error) {
      console.error('Error getting page metadata:', error);
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Return basic tab data as fallback
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
      
      if (!response.ok) throw new Error('Failed to fetch preview');
      
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

      const data = {
        title: titleInput.value,
        url: urlInput.value,
        description: JSON.stringify(content),
        categoryId: categorySelect.value,
        contentType: contentTypeSelect.value,
        previewImage: previewImage,
        additionalUrls: []
      };

      const response = await fetch(`${apiUrl}/api/resources`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

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