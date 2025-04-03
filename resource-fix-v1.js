// RESOURCE LIST FIX - V1 - Generated at: Thu Apr 03 2025
// This script has a unique name to bypass Cloudflare caching
(function() {
  console.log('🎯 RESOURCE LIST FIX V1: Starting...');
  
  // Function to extract resource ID from URL
  function getResourceIdFromUrl(url) {
    if (!url) return null;
    const match = url.match(/\/resources\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  }
  
  // Function to find all resource items and add click handlers
  function fixResourceItems() {
    // Wait for DOM to be ready
    if (!document.body) {
      setTimeout(fixResourceItems, 100);
      return;
    }
    
    // Find all resource list items
    const resourceItems = document.querySelectorAll('.resource-list-item');
    console.log(`🎯 RESOURCE LIST FIX V1: Found ${resourceItems.length} resource list items`);
    
    resourceItems.forEach((item, index) => {
      // Extract title
      const titleEl = item.querySelector('h4') || item.querySelector('h3') || item.querySelector('div > div');
      const title = titleEl ? titleEl.textContent.trim() : `Resource ${index}`;
      
      // Make entire item clickable
      item.style.cursor = 'pointer';
      
      // Add click handler
      item.addEventListener('click', function(e) {
        console.log(`🎯 RESOURCE LIST FIX V1: Clicked on "${title}"`);
        
        // Try to find resource ID
        let resourceId = null;
        
        // Method 1: Look for anchor tag with resource link
        const links = item.querySelectorAll('a[href*="/resources/"]');
        if (links.length > 0) {
          const href = links[0].getAttribute('href');
          resourceId = getResourceIdFromUrl(href);
          console.log(`🎯 Method 1 - Found resource ID from link: ${resourceId}`);
        }
        
        // Method 2: Look for data attribute
        if (!resourceId && item.dataset.resourceId) {
          resourceId = item.dataset.resourceId;
          console.log(`🎯 Method 2 - Found resource ID from data attribute: ${resourceId}`);
        }
        
        // Method 3: Get from parent element
        if (!resourceId) {
          const parent = item.closest('[data-resource-id]');
          if (parent) {
            resourceId = parent.dataset.resourceId;
            console.log(`🎯 Method 3 - Found resource ID from parent: ${resourceId}`);
          }
        }
        
        // If we found a resource ID, navigate to it
        if (resourceId) {
          console.log(`🎯 Navigating to resource: ${resourceId}`);
          window.location.href = `/resources/${resourceId}`;
          e.preventDefault();
          e.stopPropagation();
          return false;
        } else {
          console.log('🎯 Could not find resource ID for this item');
        }
      });
      
      // Add visual indicator that it's clickable
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'transparent';
      overlay.style.zIndex = '1';
      
      // Only add overlay if position is not already set
      const itemPosition = window.getComputedStyle(item).position;
      if (itemPosition === 'static') {
        item.style.position = 'relative';
      }
      
      // Add debugging indicator in top right
      const debugLabel = document.createElement('span');
      debugLabel.textContent = '⚡';
      debugLabel.style.position = 'absolute';
      debugLabel.style.top = '5px';
      debugLabel.style.right = '5px';
      debugLabel.style.color = '#2563eb';
      debugLabel.style.fontWeight = 'bold';
      debugLabel.style.fontSize = '16px';
      debugLabel.style.zIndex = '999';
      debugLabel.style.padding = '2px 5px';
      
      // Add elements to the DOM
      item.appendChild(overlay);
      item.appendChild(debugLabel);
    });
  }
  
  // Run immediately and also on load
  fixResourceItems();
  window.addEventListener('load', fixResourceItems);
  
  // Also run when mutation observer detects changes
  const observer = new MutationObserver(function(mutations) {
    fixResourceItems();
  });
  
  // Start observing when the DOM is ready
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})(); 