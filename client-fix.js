// Client-side fix for URL issues and old UI
// Copy and paste this ENTIRE script into your browser console on the site

(function() {
  console.log('Applying emergency client-side fixes...');
  
  // Fix 1: Force all ResourceCard components to use the new styling
  // Look for any resource cards and update their styling
  const cards = document.querySelectorAll('.card');
  console.log(`Found ${cards.length} cards to update`);
  
  cards.forEach(card => {
    // Add debugging click handler
    card.addEventListener('click', function(e) {
      console.log('Card clicked:', this);
      const resourceId = this.getAttribute('data-resource-id') || 
                        this.querySelector('[data-resource-id]')?.getAttribute('data-resource-id');
      
      if (resourceId) {
        console.log('Setting URL for resource:', resourceId);
        history.pushState({resourceId}, '', `#resource=${resourceId}`);
        
        // Trigger a custom event that the app might be listening for
        try {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          window.dispatchEvent(new PopStateEvent('popstate'));
          
          // Also try direct event dispatch
          const event = new CustomEvent('resource-click', { 
            detail: { id: resourceId, timestamp: new Date().toISOString() } 
          });
          document.dispatchEvent(event);
        } catch (err) {
          console.error('Error dispatching events:', err);
        }
      }
    });
    
    // Update card styling
    card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    card.style.transition = 'transform 0.2s, box-shadow 0.2s';
    
    // Add hover effects
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
  });

  // Fix 2: Add click handler to the body to inspect clicks
  document.body.addEventListener('click', function(e) {
    // Look for card elements in the event path
    const path = e.composedPath() || e.path || (e.target ? getEventPath(e.target) : []);
    const cardInPath = path.find(el => el.classList && el.classList.contains('card'));
    
    if (cardInPath) {
      console.log('Card clicked via event delegation:', cardInPath);
    }
  }, true);
  
  // Helper to get event path for browsers that don't support composedPath
  function getEventPath(element) {
    const path = [];
    let currentElement = element;
    while (currentElement) {
      path.push(currentElement);
      currentElement = currentElement.parentElement;
    }
    if (path.indexOf(window) === -1 && path.indexOf(document) === -1) {
      path.push(document);
    }
    if (path.indexOf(window) === -1) {
      path.push(window);
    }
    return path;
  }
  
  // Fix 3: Override/patch Next.js router to prevent interference with hash
  try {
    // Find the Next.js router instance if it exists
    if (window.__NEXT_DATA__ && window.next) {
      console.log('Found Next.js, patching router...');
      
      // Create a MutationObserver to watch for URL changes
      const observer = new MutationObserver(mutations => {
        const hash = window.location.hash;
        if (hash && hash.includes('resource=')) {
          console.log('Preserving hash in URL:', hash);
          setTimeout(() => {
            if (!window.location.hash.includes('resource=')) {
              window.location.hash = hash;
            }
          }, 10);
        }
      });
      
      // Start observing the whole document for URL-relevant changes
      observer.observe(document, { 
        subtree: true, 
        childList: true,
        attributes: true, 
        attributeFilter: ['href'] 
      });
    }
  } catch (e) {
    console.error('Error patching Next.js router:', e);
  }
  
  console.log('Client-side fixes applied. Try clicking a resource card now!');
})(); 