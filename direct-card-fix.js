// DIRECT CARD FIX - Timestamp: 1743701104
(function() {
  function fixCards() {
    // Wait for DOM to be ready
    if (!document.body) {
      setTimeout(fixCards, 100);
      return;
    }
    
    console.log('📌 DIRECT FIX: Applying card fix');
    
    // Intercept all clicks on the document
    document.addEventListener('click', function(e) {
      // Try to find a card element
      let target = e.target;
      let card = null;
      
      // Walk up the DOM tree
      while (target && target !== document.body) {
        if (target.classList && target.classList.contains('card')) {
          card = target;
          break;
        }
        target = target.parentElement;
      }
      
      // If we found a card
      if (card) {
        const title = card.querySelector('h6')?.textContent || 'No title';
        console.log('📌 DIRECT FIX: Card clicked:', title);
        
        // Try to find a resource ID by looking for links
        const links = card.querySelectorAll('a');
        let resourceId = null;
        
        for (const link of links) {
          const href = link.getAttribute('href');
          if (href && href.includes('/resources/')) {
            resourceId = href.split('/resources/')[1];
            break;
          }
        }
        
        // If we didn't find a resource ID in links, try to find it in the DOM structure
        if (!resourceId) {
          // Look for data attributes
          if (card.dataset && card.dataset.resourceId) {
            resourceId = card.dataset.resourceId;
          } else {
            // Or try to parse from classes or IDs
            const classMatch = card.className.match(/resource-([a-zA-Z0-9-]+)/);
            if (classMatch && classMatch[1]) {
              resourceId = classMatch[1];
            }
          }
        }
        
        if (resourceId) {
          console.log('📌 DIRECT FIX: Found resource ID:', resourceId);
          
          // Prevent the default action
          e.preventDefault();
          e.stopPropagation();
          
          // Navigate to the resource
          window.location.href = `/resources/${resourceId}`;
          
          return false;
        } else {
          console.log('📌 DIRECT FIX: Could not find resource ID for card:', title);
        }
      }
    }, true); // Use capture phase
    
    console.log('📌 DIRECT FIX: Card click handler installed');
  }
  
  // Start the fix
  fixCards();
})(); 