// Image fix for 404 errors
// Copy and paste this into your browser console

(function() {
  console.log('Applying image fixes for 404s...');
  
  // 1. Set default image for all broken images
  const handleImageError = (event) => {
    console.log('Fixing broken image:', event.target.src);
    
    // Try to fix double-dash issue in resource IDs
    if (event.target.src.includes('resource--')) {
      // Try using single dash version
      const fixedUrl = event.target.src.replace('resource--', 'resource-');
      console.log('Attempting to fix URL:', fixedUrl);
      event.target.src = fixedUrl;
    } else {
      // Use a default image placeholder
      event.target.src = 'https://via.placeholder.com/300x200?text=Preview+Not+Available';
      
      // Add some styling to make it look better
      event.target.style.objectFit = 'cover';
      event.target.style.backgroundColor = '#f8f9fa';
    }
  };
  
  // Add error handlers to all images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', handleImageError);
    
    // If the image already failed to load, fix it now
    if (!img.complete || img.naturalHeight === 0) {
      handleImageError({ target: img });
    }
  });
  
  // 2. Create a MutationObserver to handle images added dynamically
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(node => {
          // Check if the added node is an image or contains images
          if (node.nodeName === 'IMG') {
            node.addEventListener('error', handleImageError);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('img').forEach(img => {
              img.addEventListener('error', handleImageError);
            });
          }
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // 3. Fix any broken card backgrounds
  document.querySelectorAll('.card-img-top').forEach(cardImg => {
    const bgImage = window.getComputedStyle(cardImg).backgroundImage;
    
    if (bgImage.includes('resource--')) {
      // Fix double-dash issue
      const fixedUrl = bgImage.replace('resource--', 'resource-');
      cardImg.style.backgroundImage = fixedUrl;
    }
    
    // Set a fallback background color
    if (!bgImage || bgImage === 'none' || bgImage.includes('undefined')) {
      cardImg.style.backgroundColor = '#f8f9fa';
    }
  });
  
  console.log('Image fixes applied. 404 errors should be handled now.');
})(); 