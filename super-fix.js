// SUPER FIX - Targeted fix for resource cards with ID extraction
(function() {
  console.log('🔥 SUPER FIX FOR RESOURCE CARDS APPLIED');
  
  // Helper to find the real resource ID from any element
  function findResourceId(element) {
    // Try to find data attributes first (most reliable)
    let currentEl = element;
    let attempts = 0;
    const MAX_ATTEMPTS = 10;
    
    while (currentEl && attempts < MAX_ATTEMPTS) {
      // Check for data attributes
      if (currentEl.dataset && currentEl.dataset.resourceId) {
        return currentEl.dataset.resourceId;
      }
      
      // Check for id attribute that might contain resource ID
      if (currentEl.id && currentEl.id.match(/resource-[a-zA-Z0-9]+/)) {
        return currentEl.id.replace('resource-', '');
      }
      
      // Look for resource ID in class names
      if (currentEl.className && typeof currentEl.className === 'string') {
        const classMatch = currentEl.className.match(/resource-([a-zA-Z0-9]+)/);
        if (classMatch && classMatch[1]) {
          return classMatch[1];
        }
      }
      
      // Check for resource ID in href or other attributes
      if (currentEl.href && currentEl.href.includes('/resources/')) {
        const parts = currentEl.href.split('/resources/');
        if (parts[1]) {
          return parts[1].split(/[#?]/)[0]; // Remove query params
        }
      }
      
      // Move up the DOM tree
      currentEl = currentEl.parentElement;
      attempts++;
    }
    
    // Try a different approach - look for card titles
    const cardTitle = element.querySelector('.card-title') || 
                     element.querySelector('h6') || 
                     element.closest('.card').querySelector('h6');
    
    if (cardTitle) {
      // Find the associated resource ID elsewhere in the DOM
      const cards = document.querySelectorAll('.card');
      for (const card of cards) {
        const title = card.querySelector('h6');
        if (title && title.textContent === cardTitle.textContent) {
          // This is the same card, check for ID indicators
          const resourceIdElement = card.querySelector('[data-resource-id]');
          if (resourceIdElement) {
            return resourceIdElement.dataset.resourceId;
          }
          
          // Check URL patterns in links
          const links = card.querySelectorAll('a');
          for (const link of links) {
            if (link.href && link.href.includes('/resources/')) {
              const parts = link.href.split('/resources/');
              if (parts[1]) {
                return parts[1].split(/[#?]/)[0]; // Remove query params
              }
            }
          }
        }
      }
    }
    
    // Last resort - look for any nearby valid IDs
    const resourceLinks = document.querySelectorAll('a[href*="/resources/"]');
    for (const link of resourceLinks) {
      const rect1 = element.getBoundingClientRect();
      const rect2 = link.getBoundingClientRect();
      
      // Check if they're reasonably close to each other
      const isNearby = Math.abs(rect1.top - rect2.top) < 100 && 
                       Math.abs(rect1.left - rect2.left) < 100;
      
      if (isNearby) {
        const parts = link.href.split('/resources/');
        if (parts[1]) {
          return parts[1].split(/[#?]/)[0]; // Remove query params
        }
      }
    }
    
    return null;
  }
  
  // The main function to handle resource card clicks
  function handleResourceCardClick(event) {
    // Find if this is a resource card or a child of one
    let target = event.target;
    let isResourceCard = false;
    let resourceCard = null;
    
    // Check if target or any parent is a resource card
    while (target && target !== document.body) {
      if (target.classList && 
          (target.classList.contains('card') || 
           target.classList.contains('resource-card') ||
           target.className.indexOf('resource') >= 0)) {
        isResourceCard = true;
        resourceCard = target;
        break;
      }
      target = target.parentElement;
    }
    
    if (!isResourceCard || !resourceCard) return;
    
    // Don't handle clicks on buttons or links within cards (except the main card click)
    if (event.target.tagName === 'BUTTON' || 
        (event.target.tagName === 'A' && !event.target.classList.contains('card'))) {
      return;
    }
    
    // Extract the resource ID
    const resourceId = findResourceId(resourceCard);
    
    if (!resourceId) {
      console.log('🔴 Could not determine resource ID for card:', resourceCard);
      return;
    }
    
    // Don't process preview IDs
    if (resourceId.includes('-preview')) {
      console.log('🔶 Skipping preview ID:', resourceId);
      return;
    }
    
    console.log('✅ SUPER FIX: Resource card clicked with ID:', resourceId);
    
    // Update the URL
    window.history.pushState({resourceId}, '', `/resources/${resourceId}`);
    
    // Try to navigate programmatically
    try {
      // Try different approaches to trigger the right navigation
      
      // 1. Use Next.js router if available
      if (window.__NEXT_DATA__ && window.next) {
        console.log('✅ Using Next.js router');
        window.next.router.push(`/resources/${resourceId}`);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      
      // 2. Dispatch a custom event that the app might be listening for
      const customEvent = new CustomEvent('resource-view', {
        detail: { resourceId, method: 'super-fix' }
      });
      document.dispatchEvent(customEvent);
      
      // 3. Look for and click an existing link to this resource
      const resourceLinks = document.querySelectorAll(`a[href="/resources/${resourceId}"]`);
      if (resourceLinks.length > 0) {
        console.log('✅ Found and clicking existing resource link');
        resourceLinks[0].click();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      
      // 4. Create a temporary link and click it
      const tempLink = document.createElement('a');
      tempLink.href = `/resources/${resourceId}`;
      tempLink.target = '_blank';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
      event.preventDefault();
      event.stopPropagation();
    } catch (error) {
      console.error('❌ Error in super fix:', error);
    }
  }
  
  // Add the global click listener
  document.addEventListener('click', handleResourceCardClick, true);
  
  console.log('🚀 SUPER FIX REGISTERED - Resource cards should now work properly!');
})(); 