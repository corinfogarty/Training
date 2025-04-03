// Preview Image Fix - Fix 404 errors on resource preview images
(function() {
  console.log('📷 Resource Preview Image Fix Applied');
  
  // Simple function to check if an image URL exists
  async function checkImageExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  // Fix preview images that have the wrong format
  function fixResourcePreviewImages() {
    // Look for all card image elements
    const cardImages = document.querySelectorAll('.card-img-top');
    
    cardImages.forEach(async (imgDiv) => {
      const style = window.getComputedStyle(imgDiv);
      const backgroundImage = style.backgroundImage;
      
      // If there's a background image
      if (backgroundImage && backgroundImage !== 'none') {
        // Extract the URL
        const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          const originalUrl = urlMatch[1];
          
          // Check if the URL contains "-preview" which seems problematic
          if (originalUrl.includes('-preview')) {
            // Create alternate URLs to try
            const alternateUrls = [
              originalUrl.replace('-preview', ''),
              originalUrl.replace('-preview.png', '.png'),
              originalUrl.replace('-preview.jpg', '.jpg'),
              `/assets/previews/${originalUrl.split('/').pop().replace('-preview', '')}`
            ];
            
            // Try to load each alternate URL
            for (const url of alternateUrls) {
              const exists = await checkImageExists(url);
              if (exists) {
                console.log('✅ Fixed broken preview image:', originalUrl, '→', url);
                imgDiv.style.backgroundImage = `url(${url})`;
                break;
              }
            }
          }
        }
      }
    });
  }
  
  // Run once on page load
  setTimeout(fixResourcePreviewImages, 500);
  
  // Also set up a mutation observer to catch dynamically added cards
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        setTimeout(fixResourcePreviewImages, 200);
        break;
      }
    }
  });
  
  // Start observing the body for changes
  observer.observe(document.body, { childList: true, subtree: true });
  
  console.log('🚀 Preview Image Fix Ready');
})(); 