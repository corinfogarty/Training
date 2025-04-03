// RESOURCE FIX V2 - Nuclear option - All clicks captured
// Uses a global click listener and additional resource ID extraction methods
(function() {
  console.log('💥 RESOURCE FIX V2: Starting - Nuclear option');
  
  // Function to extract resource ID from URL
  function getResourceIdFromUrl(url) {
    if (!url) return null;
    // Try multiple regex patterns
    const patterns = [
      /\/resources\/([a-zA-Z0-9-]+)/,
      /resource=([a-zA-Z0-9-]+)/,
      /id=([a-zA-Z0-9-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
  
  // Function to extract resource ID from element or its children
  function getResourceIdFromElement(element) {
    // Method 1: data-resource-id attribute
    if (element.dataset && element.dataset.resourceId) {
      return element.dataset.resourceId;
    }
    
    // Method 2: href attribute containing resource ID
    if (element.href) {
      const id = getResourceIdFromUrl(element.href);
      if (id) return id;
    }
    
    // Method 3: Look for anchors inside the element
    const links = element.querySelectorAll('a[href*="/resources/"]');
    if (links.length > 0) {
      const href = links[0].getAttribute('href');
      return getResourceIdFromUrl(href);
    }
    
    // Method 4: Check for data-attributes in parent elements
    let parent = element.closest('[data-resource-id]');
    if (parent) {
      return parent.dataset.resourceId;
    }
    
    // Method 5: Look for resource ID in any child with data attribute
    const withData = element.querySelector('[data-resource-id]');
    if (withData) {
      return withData.dataset.resourceId;
    }
    
    // Method 6: Try to find first anchor with href containing resources
    const allLinks = element.querySelectorAll('a');
    for (const link of allLinks) {
      const href = link.getAttribute('href');
      if (href && href.includes('resource')) {
        const id = getResourceIdFromUrl(href);
        if (id) return id;
      }
    }
    
    return null;
  }
  
  // Function to handle all clicks on the page
  function handlePageClick(e) {
    // Find if we clicked on or inside a resource-list-item
    let target = e.target;
    let resourceItem = null;
    
    // Traverse up the DOM to find resource-list-item
    while (target && target !== document) {
      if (target.classList && target.classList.contains('resource-list-item')) {
        resourceItem = target;
        break;
      }
      target = target.parentNode;
    }
    
    if (!resourceItem) {
      return; // Not a click on a resource item
    }
    
    console.log('💥 RESOURCE FIX V2: Card clicked!');
    
    // Try to find the resource ID
    const resourceId = getResourceIdFromElement(resourceItem);
    
    if (resourceId) {
      console.log(`💥 RESOURCE FIX V2: Found resource ID: ${resourceId}`);
      console.log(`💥 RESOURCE FIX V2: Navigating to /resources/${resourceId}`);
      
      // Navigate to the resource page
      window.location.href = `/resources/${resourceId}`;
      
      // Prevent default behavior
      e.preventDefault();
      e.stopPropagation();
      return false;
    } else {
      console.log('💥 RESOURCE FIX V2: Could not find resource ID');
      // Let's grab some more debug info
      console.log('Element HTML:', resourceItem.outerHTML);
    }
  }
  
  // Add visual indicators to resource items
  function markResourceItems() {
    const resourceItems = document.querySelectorAll('.resource-list-item');
    console.log(`💥 RESOURCE FIX V2: Found ${resourceItems.length} resource items to mark`);
    
    resourceItems.forEach((item, index) => {
      // Skip if already marked
      if (item.dataset.markedV2) return;
      
      // Mark as processed
      item.dataset.markedV2 = 'true';
      
      // Make the item look clickable
      item.style.cursor = 'pointer';
      
      // Add a visual indicator - this is a bright icon that should be visible
      const indicator = document.createElement('div');
      indicator.innerHTML = '🔥';
      indicator.style.position = 'absolute';
      indicator.style.top = '5px';
      indicator.style.right = '5px';
      indicator.style.fontSize = '20px';
      indicator.style.zIndex = '9999';
      indicator.style.backgroundColor = 'rgba(255,255,255,0.8)';
      indicator.style.padding = '2px 8px';
      indicator.style.borderRadius = '4px';
      
      // Ensure the item has position relative for absolute positioning
      const itemPosition = window.getComputedStyle(item).position;
      if (itemPosition === 'static') {
        item.style.position = 'relative';
      }
      
      // Add indicator to the item
      item.appendChild(indicator);
      
      // Extract potential resourceId for debugging
      const potentialId = getResourceIdFromElement(item);
      if (potentialId) {
        console.log(`💥 Resource #${index} has ID: ${potentialId}`);
      }
    });
  }
  
  // Run the marker function frequently
  function setupMarker() {
    // Run immediately
    markResourceItems();
    
    // Run again after a short delay
    setTimeout(markResourceItems, 500);
    
    // Set up mutation observer to mark new items
    const observer = new MutationObserver(markResourceItems);
    
    // Start observing when DOM is ready
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      window.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
    
    // Also run periodically just to be sure
    setInterval(markResourceItems, 2000);
  }
  
  // Set up the global click handler
  function setupClickHandler() {
    document.addEventListener('click', handlePageClick, true);
    console.log('💥 RESOURCE FIX V2: Global click handler installed');
  }
  
  // Run our setup functions
  setupMarker();
  setupClickHandler();
  
  // Also run when document is fully loaded
  window.addEventListener('load', function() {
    setupMarker();
  });
  
  console.log('💥 RESOURCE FIX V2: Setup complete');
})(); 