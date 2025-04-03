// CARD CLICK DIAGNOSTIC - Timestamp: 1743700658
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 CARD DIAGNOSTIC: DOM ready, setting up monitors');
  
  // Wait a bit to ensure everything is fully loaded
  setTimeout(function() {
    // Find all cards
    const cards = document.querySelectorAll('.card');
    console.log(`🔍 CARD DIAGNOSTIC: Found ${cards.length} cards on the page`);
    
    // Log card details
    cards.forEach((card, index) => {
      const title = card.querySelector('h6')?.textContent || 'No title';
      console.log(`🔍 Card #${index}: "${title}" with classes: ${card.className}`);
      
      // Add our diagnostic click handler with highest priority
      card.addEventListener('click', function(e) {
        console.log(`🔍 CARD CLICKED: "${title}" with tag ${e.target.tagName}`);
        console.log('🔍 Event details:', {
          target: e.target.tagName,
          currentTarget: e.currentTarget.tagName,
          defaultPrevented: e.defaultPrevented,
          eventPhase: e.eventPhase
        });
        
        // Don't interfere with normal operation
      }, true); // Capture phase to run first
    });
    
    // Also add global document click handler to catch all clicks
    document.addEventListener('click', function(e) {
      // See if this is clicking on a card or inside a card
      let cardElement = null;
      let target = e.target;
      
      // Walk up the DOM tree to find a card
      while (target && target !== document.body) {
        if (target.classList && target.classList.contains('card')) {
          cardElement = target;
          break;
        }
        target = target.parentNode;
      }
      
      if (cardElement) {
        console.log('🔍 GLOBAL MONITOR: Card click detected via bubbling', {
          cardTitle: cardElement.querySelector('h6')?.textContent || 'No title',
          originalTarget: e.target.tagName
        });
      }
    }, false); // Bubbling phase
    
    console.log('🔍 CARD DIAGNOSTIC: Monitoring ready - click on cards to see diagnostics');
    
    // Add visual indicator
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.top = '10px';
    indicator.style.left = '10px';
    indicator.style.backgroundColor = 'blue';
    indicator.style.color = 'white';
    indicator.style.padding = '10px';
    indicator.style.borderRadius = '5px';
    indicator.style.fontSize = '12px';
    indicator.style.zIndex = '99999';
    indicator.textContent = `Card Click Diagnostic Active (${cards.length} cards)`;
    
    if (document.body) {
      document.body.appendChild(indicator);
    }
  }, 1000); // Wait 1 second for everything to load
}); 