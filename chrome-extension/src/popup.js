import { apiUrl } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const titleInput = document.getElementById('title');
  const urlInput = document.getElementById('url');
  const descriptionInput = document.getElementById('description');
  const categorySelect = document.getElementById('category');
  const submitButton = document.getElementById('submit');
  const messageDiv = document.getElementById('message');
  const previewImageEl = document.getElementById('preview-image');
  let previewImage = null;

  function updatePreviewImage(imageUrl) {
    if (imageUrl) {
      previewImage = imageUrl;
      previewImageEl.src = imageUrl;
      previewImageEl.style.display = 'block';
    } else {
      previewImage = null;
      previewImageEl.style.display = 'none';
    }
  }

  // Get current tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  urlInput.value = tab.url;
  titleInput.value = tab.title;

  // Fetch preview data for the current URL
  try {
    const previewResponse = await fetch(`${apiUrl}/api/preview?url=${encodeURIComponent(tab.url)}`, {
      credentials: 'include'
    });
    const previewData = await previewResponse.json();
    if (previewData.description) {
      descriptionInput.value = previewData.description;
    }
    if (previewData.image) {
      updatePreviewImage(previewData.image);
    }
  } catch (error) {
    console.error('Preview error:', error);
  }

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

  // Update preview when URL changes
  urlInput.addEventListener('change', async () => {
    try {
      const previewResponse = await fetch(`${apiUrl}/api/preview?url=${encodeURIComponent(urlInput.value)}`, {
        credentials: 'include'
      });
      const previewData = await previewResponse.json();
      if (previewData.description) {
        descriptionInput.value = previewData.description;
      }
      if (previewData.title && !titleInput.value) {
        titleInput.value = previewData.title;
      }
      if (previewData.image) {
        updatePreviewImage(previewData.image);
      } else {
        updatePreviewImage(null);
      }
    } catch (error) {
      console.error('Preview error:', error);
      updatePreviewImage(null);
    }
  });

  // Handle form submission
  submitButton.addEventListener('click', async () => {
    if (!titleInput.value || !urlInput.value || !categorySelect.value) {
      messageDiv.textContent = 'Please fill in all required fields';
      messageDiv.className = 'error';
      return;
    }

    try {
      // Format description as JSON to match the main app
      const content = {
        title: titleInput.value,
        description: descriptionInput.value || titleInput.value,
        credentials: {},
        courseContent: [],
        previewImage: previewImage,
        url: urlInput.value
      };

      const data = {
        title: titleInput.value,
        url: urlInput.value,
        description: JSON.stringify(content),
        categoryId: categorySelect.value,
        type: 'LINK',
        previewImage: previewImage
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

      const responseData = await response.json();
      console.log('Response:', response.status, responseData);

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
      updatePreviewImage(null);
      
    } catch (error) {
      console.error('Submit error:', error);
      messageDiv.textContent = error.message || 'Error adding resource';
      messageDiv.className = 'error';
    }
  });
}); 