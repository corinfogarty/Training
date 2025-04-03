// NUCLEAR FIX OPTION - Will forcibly override any bundle issues
(function() {
  console.log('🚨 APPLYING NUCLEAR FIX FOR RESOURCE CARDS');
  
  // Store the original implementation of any handleCardClick function
  let originalHandleCardClick = null;
  
  // Function to forcibly patch the bundle code
  function patchHandleCardClick() {
    try {
      // Find any ResourceCard component implementation in the global objects
      const allScripts = Array.from(document.scripts);
      
      // Inject our global openResource function immediately
      window.openResource = function(id) {
        console.log('⚡ NUCLEAR openResource called with id:', id);
        
        // Update URL with pushState
        try {
          window.history.pushState({resourceId: id}, '', `#resource=${id}`);
          console.log('✅ URL updated to:', window.location.hash);
          
          // Directly call any existing showResource function from the app
          if (typeof window.showResource === 'function') {
            console.log('📲 Calling existing showResource function');
            window.showResource(id);
          }
          
          // Dispatch a custom event for other parts of the app
          document.dispatchEvent(new CustomEvent('resource-open', { 
            detail: { id, timestamp: new Date().toISOString() } 
          }));
          
          return true;
        } catch (error) {
          console.error('❌ Error updating URL:', error);
          
          // Fallback to old hash method
          try {
            window.location.hash = `resource=${id}`;
            return true;
          } catch(e) {
            console.error('❌ Even hash fallback failed:', e);
            return false;
          }
        }
      };
    } catch (error) {
      console.error('❌ Error patching handleCardClick:', error);
    }
  }
  
  // Ultra-aggressive click capture for any card-like elements
  function setupGlobalClickHandler() {
    document.addEventListener('click', function(e) {
      // Look for card-like elements up to 10 levels up
      let target = e.target;
      let level = 0;
      
      // Only process once per click
      let processed = false;
      
      while (target && target !== document.body && level < 10 && !processed) {
        // If it looks like a card or resource item
        if (target.classList && 
            (target.classList.contains('card') || 
             target.classList.contains('resource-list-item') ||
             target.classList.contains('card-body') ||
             (target.className && target.className.includes('resource')))) {
          
          // First try to find explicit resource ID
          let resourceId = target.getAttribute('data-resource-id');
          
          // Second try: look for resource ID in URL attributes
          if (!resourceId) {
            const links = target.querySelectorAll('a[href*="resource="]');
            if (links.length > 0) {
              try {
                const href = links[0].getAttribute('href');
                resourceId = new URLSearchParams(href.split('#')[1]).get('resource');
              } catch (e) {}
            }
          }
          
          // Third try: look for resource ID in any attribute
          if (!resourceId) {
            const allElements = target.querySelectorAll('*');
            for (const el of allElements) {
              const attrs = el.attributes;
              for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];
                if (attr.value && attr.value.includes('resource-')) {
                  const match = attr.value.match(/resource-([a-zA-Z0-9_-]+)/);
                  if (match && match[1]) {
                    resourceId = match[1];
                    break;
                  }
                }
              }
              if (resourceId) break;
            }
          }
          
          // Fourth try: look for resource ID in text content
          if (!resourceId && target.textContent) {
            const match = target.textContent.match(/resource[=:-]([a-zA-Z0-9_-]+)/i);
            if (match && match[1]) {
              resourceId = match[1];
            }
          }
          
          // If resource ID is found, use it
          if (resourceId) {
            console.log('⚡ NUCLEAR HANDLER: Card click detected for resource:', resourceId);
            e.preventDefault();
            e.stopPropagation();
            
            // Use our global handler
            window.openResource(resourceId);
            processed = true;
            return false;
          }
        }
        
        level++;
        target = target.parentNode;
      }
    }, true); // Use capture phase for earliest interception
  }
  
  // Set up MutationObserver to add data-resource-id to cards
  function setupMutationObserver() {
    // Function to identify and tag resource elements
    function tagResourceElements(rootElement = document) {
      // Tag cards with resource IDs
      const cards = rootElement.querySelectorAll('.card, .resource-list-item, [class*="resource"]');
      
      cards.forEach(card => {
        // Skip if already processed
        if (card.hasAttribute('data-nuclear-processed')) return;
        
        // Mark as processed
        card.setAttribute('data-nuclear-processed', 'true');
        
        // Try various strategies to find the resource ID
        try {
          // Strategy 1: Look for ID in href attributes
          const links = card.querySelectorAll('a[href*="resource="]');
          if (links.length > 0) {
            const href = links[0].getAttribute('href');
            const resourceId = new URLSearchParams(href.split('#')[1]).get('resource');
            if (resourceId) {
              card.setAttribute('data-resource-id', resourceId);
              console.log('✅ Tagged card with resource ID:', resourceId);
            }
          }
          
          // Strategy 2: Look for resource ID in data attributes
          if (!card.hasAttribute('data-resource-id')) {
            const allElements = card.querySelectorAll('*');
            for (const el of allElements) {
              const dataAttrs = Array.from(el.attributes)
                .filter(attr => attr.name.startsWith('data-') && attr.value);
              
              for (const attr of dataAttrs) {
                if (attr.value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                  // Looks like a UUID, probably a resource ID
                  card.setAttribute('data-resource-id', attr.value);
                  console.log('✅ Tagged card with UUID-like resource ID:', attr.value);
                  break;
                }
              }
              
              if (card.hasAttribute('data-resource-id')) break;
            }
          }
          
          // When we find a resource ID, make the whole card obviously clickable
          if (card.hasAttribute('data-resource-id')) {
            card.style.cursor = 'pointer';
          }
        } catch (e) {
          console.error('❌ Error tagging resource element:', e);
        }
      });
    }
    
    // Initial run
    tagResourceElements();
    
    // Set up observer for future DOM changes
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              tagResourceElements(node);
            }
          });
        }
      }
    });
    
    // Start observing the entire document
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }
  
  // Wait for DOM to be interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      patchHandleCardClick();
      setupGlobalClickHandler();
      setupMutationObserver();
    });
  } else {
    // DOM already loaded, run immediately
    patchHandleCardClick();
    setupGlobalClickHandler();
    setupMutationObserver();
  }
  
  // Also run when hash changes
  window.addEventListener('hashchange', () => {
    console.log('⚡ Hash changed:', window.location.hash);
    
    // Try to extract resource ID
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const id = params.get('resource');
    if (id) {
      console.log('⚡ Resource ID from hash:', id);
      
      // Refresh resource cards with the current state
      setupMutationObserver();
    }
  });
  
  console.log('🚀 NUCLEAR FIX REGISTERED - Resource cards should work now!');
})(); 