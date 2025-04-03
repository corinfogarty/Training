// Override card fix
(function() {
  // Force override the handleCardClick function in ResourceCard component
  console.log('Applying direct bundle override for ResourceCard.handleCardClick...');
  
  // Add global handler that is reliably accessible
  window.openResource = function(id) {
    console.log('🔍 Global openResource called with id:', id);
    try {
      // Update URL using pushState for better Next.js compatibility
      window.history.pushState({resourceId: id}, '', `#resource=${id}`);
      
      // Dispatch an event that our app can listen for
      const event = new CustomEvent('resource-open', { 
        detail: { id, timestamp: new Date().toISOString() } 
      });
      document.dispatchEvent(event);
      
      // Also try to directly trigger a click on the card
      try {
        // Find all cards that might contain this resource
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
          // Check if this card contains a data attribute or text with this resource ID
          if (card.innerHTML.includes(id)) {
            // Simulate a click on that card
            card.click();
            console.log('🔍 Simulated click on card for resource:', id);
          }
        });
      } catch (innerError) {
        console.error('Error finding card:', innerError);
      }
      
      return true;
    } catch (error) {
      console.error('Error in openResource:', error);
      return false;
    }
  };
  
  // Global click handler for resource cards
  document.addEventListener('click', function(e) {
    // Check if we clicked on or within a card
    let target = e.target;
    while (target && target !== document.body) {
      if (target.classList && (target.classList.contains('card') || target.classList.contains('resource-list-item'))) {
        // Look for resource ID in the URL or nearby elements
        let resourceId = null;
        
        // Try to find resource ID in data attribute
        resourceId = target.getAttribute('data-resource-id');
        
        // If not found, try to find it in child elements
        if (!resourceId) {
          const elements = target.querySelectorAll('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (el.id && el.id.startsWith('resource-')) {
              resourceId = el.id.replace('resource-', '');
              break;
            }
          }
        }
        
        // If resource ID was found, use our handler
        if (resourceId) {
          console.log('🔍 Card click detected for resource:', resourceId);
          e.preventDefault();
          e.stopPropagation();
          
          // Use our global handler
          window.openResource(resourceId);
          return false;
        }
        
        break;
      }
      target = target.parentNode;
    }
  }, true);

  // Look for resource IDs in the DOM and tag elements
  function tagResourceElements() {
    // Find all elements that might be resource cards
    const cards = document.querySelectorAll('.card, .resource-list-item');
    cards.forEach(card => {
      // Try to find any element that appears to have a resource ID
      const resourceElements = card.querySelectorAll('[id^="resource-"]');
      if (resourceElements.length > 0) {
        const resourceId = resourceElements[0].id.replace('resource-', '');
        card.setAttribute('data-resource-id', resourceId);
      }
    });
  }
  
  // Run when DOM changes
  const observer = new MutationObserver(tagResourceElements);
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial run
  document.addEventListener('DOMContentLoaded', tagResourceElements);
  
  // Run on hash changes (for SPA navigation)
  window.addEventListener('hashchange', function() {
    // Extract resource ID from hash
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const id = params.get('resource');
    if (id) {
      console.log('🔍 Hash changed to resource:', id);
      // Let the app handle it, but make our openResource available
    }
  });
  
  console.log('ResourceCard override registered successfully');
})(); 