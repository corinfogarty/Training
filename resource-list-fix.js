// RESOURCE LIST FIX - Specific for resource-list-item elements
(function() {
  console.log('🎯 RESOURCE LIST FIX: Starting...');
  
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
    console.log(`🎯 Found ${resourceItems.length} resource list items`);
    
    resourceItems.forEach(item => {
      // Extract title
      const titleEl = item.querySelector('h6');
      const title = titleEl?.textContent?.trim() || 'Unnamed resource';
      
      // Find the clickable area inside each item
      const clickableArea = item.querySelector('.d-flex.justify-content-between.align-items-center');
      
      if (clickableArea) {
        // Add a data attribute for identification
        clickableArea.setAttribute('data-resource-title', title);
        
        // Find resource ID by looking for links in the item
        let resourceId = null;
        
        // Look for links with resource URLs
        const links = item.querySelectorAll('a[href*="/resources/"]');
        if (links.length > 0) {
          for (const link of links) {
            const extractedId = getResourceIdFromUrl(link.getAttribute('href'));
            if (extractedId) {
              resourceId = extractedId;
              break;
            }
          }
        }
        
        // If no direct link found, try to extract from onclick handlers or data attributes
        if (!resourceId) {
          // Look for data attributes
          if (item.dataset && item.dataset.resourceId) {
            resourceId = item.dataset.resourceId;
          } else if (clickableArea.dataset && clickableArea.dataset.resourceId) {
            resourceId = clickableArea.dataset.resourceId;
          }
          
          // Look for onclick handlers that might contain the resource ID
          // (This is more speculative but worth trying)
          const onclickHandlers = [
            item.getAttribute('onclick'), 
            clickableArea.getAttribute('onclick')
          ].filter(Boolean);
          
          for (const handler of onclickHandlers) {
            const idMatch = handler?.match(/resources\/([a-zA-Z0-9-]+)/);
            if (idMatch) {
              resourceId = idMatch[1];
              break;
            }
          }
        }
        
        if (resourceId) {
          console.log(`🎯 Resource found: "${title}" (${resourceId})`);
          
          // Store the ID for easy access
          clickableArea.setAttribute('data-resource-id', resourceId);
          
          // Add click handler
          clickableArea.addEventListener('click', function(e) {
            console.log(`🎯 Clicked resource: "${title}" (${resourceId})`);
            
            // Navigate to the resource page
            window.location.href = `/resources/${resourceId}`;
            
            // Prevent any other handlers from firing
            e.preventDefault();
            e.stopPropagation();
            return false;
          }, true); // Use capture phase to intercept event early
          
          // Style to indicate clickable
          clickableArea.style.cursor = 'pointer';
          clickableArea.classList.add('resource-clickable');
          
          // Optional: Add a subtle hover effect
          if (!document.getElementById('resource-list-fix-styles')) {
            const style = document.createElement('style');
            style.id = 'resource-list-fix-styles';
            style.textContent = `
              .resource-clickable:hover {
                background-color: rgba(0, 0, 0, 0.03);
                transition: background-color 0.2s;
              }
            `;
            document.head.appendChild(style);
          }
        } else {
          console.log(`🎯 Could not find resource ID for: "${title}"`);
        }
      }
    });
    
    // Add visual indicator (small and subtle)
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '5px';
    indicator.style.right = '5px';
    indicator.style.backgroundColor = 'rgba(0, 128, 0, 0.7)';
    indicator.style.color = 'white';
    indicator.style.padding = '3px 6px';
    indicator.style.borderRadius = '3px';
    indicator.style.fontSize = '10px';
    indicator.style.zIndex = '999';
    indicator.textContent = `Fixed ${resourceItems.length} resources`;
    
    document.body.appendChild(indicator);
    
    console.log('🎯 RESOURCE LIST FIX: Complete');
  }
  
  // Monitor for dynamic content changes
  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && 
                (node.classList?.contains('resource-list-item') || 
                 node.querySelector?.('.resource-list-item'))) {
              shouldReapply = true;
              break;
            }
          }
        }
      });
      
      if (shouldReapply) {
        console.log('🎯 Detected new resource items, reapplying fix...');
        fixResourceItems();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    console.log('🎯 Mutation observer active');
  }
  
  // Start the fix after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fixResourceItems();
      setupMutationObserver();
    });
  } else {
    fixResourceItems();
    setupMutationObserver();
  }
})(); 