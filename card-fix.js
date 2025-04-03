// Card Fix - Run when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 Card Fix: DOM fully loaded and parsed');
  
  // Fix for resource cards
  function fixResourceCards() {
    console.log('🔍 Card Fix: Looking for resource cards');
    
    // Find all cards in the document
    const cards = document.querySelectorAll('.card');
    console.log(`🔍 Card Fix: Found ${cards.length} cards`);
    
    // Add click handlers directly to each card
    cards.forEach(card => {
      card.addEventListener('click', function(e) {
        // Skip if clicking on buttons/controls inside the card
        if (e.target.closest('button') || 
            (e.target.tagName === 'A' && !e.target.classList.contains('card'))) {
          return;
        }
        
        // Find resource ID
        const resourceId = findResourceId(card);
        if (!resourceId) {
          console.log('🔍 Card Fix: Could not determine resource ID for card:', card);
          return;
        }
        
        // Don't process preview IDs
        if (resourceId.includes('-preview')) {
          console.log('🔍 Card Fix: Skipping preview ID:', resourceId);
          return;
        }
        
        console.log('🔍 Card Fix: Card clicked with ID:', resourceId);
        
        // Navigate to the resource
        window.location.href = `/resources/${resourceId}`;
        
        // Prevent default behavior and stop propagation
        e.preventDefault();
        e.stopPropagation();
      }, true); // Use capture to get the event before other handlers
      
      console.log('🔍 Card Fix: Added click handler to card:', card);
    });
  }
  
  // Helper to find the resource ID from any element
  function findResourceId(element) {
    // Look for h6 with the resource title
    const title = element.querySelector('h6');
    if (!title) return null;
    
    // Find nearby links that might contain the resource ID
    const links = document.querySelectorAll('a[href*="/resources/"]');
    for (const link of links) {
      // Check if this link has the same text content as our title
      const linkTitle = link.querySelector('h6');
      if (linkTitle && linkTitle.textContent === title.textContent) {
        const parts = link.href.split('/resources/');
        return parts[1];
      }
    }
    
    return null;
  }
  
  // Run the fix immediately
  fixResourceCards();
  
  // Also set up a handler for page updates
  setTimeout(fixResourceCards, 1000); // Run again after 1 second for any dynamic content
  
  console.log('🚀 Card Fix: Ready and monitoring for card clicks');
});

// Debug tool to show what's happening on cards
document.addEventListener('click', function(e) {
  const card = e.target.closest('.card');
  if (card) {
    console.log('🔍 DEBUG: Card clicked:', card);
    console.log('🔍 DEBUG: Target was:', e.target.tagName, e.target.className);
    // Do not prevent default - this is just for debugging
  }
}, true); 