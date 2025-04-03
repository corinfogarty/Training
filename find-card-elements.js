// ELEMENT FINDER - Find all card-like elements regardless of class
document.addEventListener('DOMContentLoaded', function() {
  console.log('🧪 FINDER: Starting comprehensive element search');
  
  setTimeout(function() {
    // Find ALL potential card container elements
    const potentialCards = [
      ...document.querySelectorAll('.card'),
      ...document.querySelectorAll('[class*="card"]'),
      ...document.querySelectorAll('[class*="Card"]'),
      ...document.querySelectorAll('[class*="resource"]'),
      ...document.querySelectorAll('[class*="Resource"]'),
      ...document.querySelectorAll('[class*="item"]'),
      ...document.querySelectorAll('[class*="Item"]'),
      ...document.querySelectorAll('[class*="tile"]'),
      ...document.querySelectorAll('[class*="Tile"]'),
      ...document.querySelectorAll('.h-100'),
      ...document.querySelectorAll('.shadow-sm'),
      ...document.querySelectorAll('.mb-3'),
      ...document.querySelectorAll('div.col div')
    ];
    
    // Get h6 parent elements
    const h6Parents = [];
    document.querySelectorAll('div > h6').forEach(h => {
      if (h.parentElement) h6Parents.push(h.parentElement);
    });
    
    // Combine all potential cards
    const allPotentialCards = [...potentialCards, ...h6Parents].filter(el => el != null);
    
    // Unique elements only
    const uniqueElements = [];
    for (const el of allPotentialCards) {
      if (!uniqueElements.includes(el)) {
        uniqueElements.push(el);
      }
    }
    
    console.log(`🧪 FINDER: Found ${uniqueElements.length} potential card-like elements`);
    
    // Classify each element
    uniqueElements.forEach((element, index) => {
      // Look for title inside
      const titleEl = element.querySelector('h6, h5, h4, h3');
      const title = titleEl?.textContent?.trim() || 'No title';
      
      // Look for image inside
      const hasImage = !!element.querySelector('img') || 
                      (element.style && element.style.backgroundImage && element.style.backgroundImage !== 'none') || 
                      !!element.querySelector('[style*="background-image"]');
                      
      // Check if this looks like a card
      const isCard = hasImage || 
                    (title !== 'No title') ||
                    element.classList.contains('card') || 
                    (element.className && typeof element.className === 'string' && (
                      element.className.includes('card') ||
                      element.className.includes('Card')
                    ));
      
      if (isCard) {
        console.log(`🧪 LIKELY CARD #${index}: "${title}"`, {
          tagName: element.tagName,
          id: element.id || 'no-id',
          classes: typeof element.className === 'string' ? element.className : 'unknown-class',
          children: element.children ? element.children.length : 0,
          hasImage: hasImage
        });
        
        // Add click handler to this element
        element.addEventListener('click', function(e) {
          console.log(`🧪 ELEMENT CLICKED: "${title}"`, {
            target: e.target.tagName,
            currentTarget: e.currentTarget.tagName,
            preventDefault: e.defaultPrevented
          });
        }, true);
        
        // Add visual highlight to this element
        try {
          element.style.outline = '2px solid red';
          element.style.position = 'relative';
          
          const badge = document.createElement('div');
          badge.style.position = 'absolute';
          badge.style.top = '0';
          badge.style.right = '0';
          badge.style.backgroundColor = 'red';
          badge.style.color = 'white';
          badge.style.padding = '2px 5px';
          badge.style.fontSize = '10px';
          badge.style.zIndex = '99999';
          badge.textContent = `Card ${index}`;
          
          element.appendChild(badge);
        } catch (err) {
          console.error('Error styling element:', err);
        }
      }
    });
    
    // Add a global event listener for clicks
    document.addEventListener('click', function(e) {
      console.log('🧪 Global click:', e.target.tagName);
      
      // Get all parent elements
      let el = e.target;
      const parents = [];
      
      while (el && el !== document.body) {
        parents.push({
          tag: el.tagName,
          class: el.className,
          id: el.id
        });
        el = el.parentElement;
      }
      
      console.log('🧪 Click parents:', parents);
    }, true);
    
    // Create status indicator
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.left = '10px';
    indicator.style.backgroundColor = 'purple';
    indicator.style.color = 'white';
    indicator.style.padding = '10px';
    indicator.style.borderRadius = '5px';
    indicator.style.fontSize = '12px';
    indicator.style.zIndex = '99999';
    
    const cardCount = uniqueElements.filter(e => 
      e.querySelector('h6, h5, h4, h3') || 
      e.querySelector('img') || 
      (e.classList && e.classList.contains('card'))).length;
      
    indicator.textContent = `Found ${cardCount} potential cards`;
    
    if (document.body) {
      document.body.appendChild(indicator);
    }
  }, 2000); // Wait longer for everything to fully load
}); 