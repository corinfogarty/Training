// RESOURCE FIX V3 - Link Wrapping Approach
// Instead of trying to catch clicks, we'll wrap each card with an actual link
(function() {
  console.log('🚀 RESOURCE FIX V3: DOM Modification Approach');
  
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
  
  // Function to turn each resource item into a clickable link
  function wrapResourceItems() {
    // Find all resource list items
    const resourceItems = document.querySelectorAll('.resource-list-item');
    console.log(`🚀 RESOURCE FIX V3: Found ${resourceItems.length} resource items`);
    
    let wrapCount = 0;
    
    // Process each resource item
    resourceItems.forEach((item, index) => {
      // Skip already processed items
      if (item.dataset.processedV3) return;
      
      // Mark as processed
      item.dataset.processedV3 = 'true';
      
      // Extract the resource ID from this element
      const resourceId = getResourceIdFromElement(item);
      
      if (resourceId) {
        console.log(`🚀 Resource #${index} has ID: ${resourceId}`);
        
        // Only wrap if not already wrapped in an appropriate link
        if (!item.parentElement || item.parentElement.tagName !== 'A') {
          // Create wrapper anchor element
          const wrapper = document.createElement('a');
          wrapper.href = `/resources/${resourceId}`;
          wrapper.style.textDecoration = 'none';
          wrapper.style.color = 'inherit';
          wrapper.style.display = 'block';
          wrapper.style.cursor = 'pointer';
          
          // Replace the original element with the wrapped version
          item.parentNode.replaceChild(wrapper, item);
          wrapper.appendChild(item);
          
          // Add a clear visual indicator
          const indicator = document.createElement('div');
          indicator.innerHTML = '🔗';
          indicator.style.position = 'absolute';
          indicator.style.top = '5px';
          indicator.style.right = '5px';
          indicator.style.fontSize = '18px';
          indicator.style.zIndex = '9999';
          indicator.style.backgroundColor = 'rgba(255,255,255,0.8)';
          indicator.style.padding = '2px 5px';
          indicator.style.borderRadius = '4px';
          indicator.style.pointerEvents = 'none'; // Prevent this from blocking clicks
          
          // Ensure item has position relative if it doesn't already
          const itemPosition = window.getComputedStyle(item).position;
          if (itemPosition === 'static') {
            item.style.position = 'relative';
          }
          
          // Add indicator
          item.appendChild(indicator);
          
          wrapCount++;
        }
      } else {
        console.log(`🚀 Could not find resource ID for item #${index}`);
      }
    });
    
    console.log(`🚀 RESOURCE FIX V3: Wrapped ${wrapCount} resource items with direct links`);
  }
  
  // Function to periodically check and wrap resource items
  function setupWrappers() {
    // Run immediately
    wrapResourceItems();
    
    // Run again after a short delay
    setTimeout(wrapResourceItems, 500);
    
    // Set up mutation observer to watch for new items
    const observer = new MutationObserver(function() {
      wrapResourceItems();
    });
    
    // Start observing the document body
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      window.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
    
    // Also run periodically to be absolutely certain
    setInterval(wrapResourceItems, 2000);
  }
  
  // Run our setup
  setupWrappers();
  
  // Also run when the document is loaded
  window.addEventListener('load', setupWrappers);
  
  console.log('🚀 RESOURCE FIX V3: Setup complete');
})(); 